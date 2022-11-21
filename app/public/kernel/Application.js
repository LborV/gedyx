class Application {
   /**
    * The constructor function takes in a configuration object and sets up the application
    * @param configuration - The configuration object that is passed to the constructor.
    * @returns The instance of the application.
    */
    constructor(configuration) {
        this.controllers = {};    
        this.useSockets = false;
        this.socketsURL = false;
        this.useSession = true;
        this.appStarted = false;
        this.useLocalStorage = true;
        this.socketConfigs = {};
        this.viewsLoadedCount = 0;
        this.firstLoadElementId = configuration.firstLoadElementId;

        if(configuration.routing !== undefined) {
            this.routing = configuration.routing;
        } else {
            this.routing = [];
            if(configuration.controllers !== undefined) {
                configuration.controllers.forEach(controller => {
                    this.routing[`/${controller.name}`] = controller.name;
                });
            } 
        }

        if(configuration.useSession !== undefined) {
            this.useSession = configuration.useSession;
        }

        if(configuration.useLocalStorage !== undefined) {
            this.useLocalStorage = configuration.useLocalStorage;
        }

        if(this.useLocalStorage) {
            let views = JSON.parse(localStorage.getItem('views'));
            globalThis.views = [];

            if(views) {
                globalThis.views = views;
            }

            window.onbeforeunload = () => {
                this.onClose();
                localStorage.setItem('views', JSON.stringify(globalThis.views));
            };
        }

        if(configuration.useSockets !== undefined && configuration.socketsURL !== undefined) {
            this.useSockets = configuration.useSockets;
            this.socketsURL = configuration.socketsURL;
            
            if(configuration.socketConfigs !== undefined) {
                this.socketConfigs = configuration.socketConfigs;
            }
        }

        if(configuration.controllers !== undefined) {
            this.controllers_configuration = configuration.controllers;
        }

        try {
        this.loadControllers()
            // .then(() => this.startApplication())
            .then(() => {
                window.onpopstate = (event) => this.changePath(event.target.location.href);
            })
            .catch(error => console.error(error));
            return this;
        } catch {
            return false;
        }
    }

    /**
     * Set a cookie with a value and an expiration date
     * @param cname - The name of the cookie.
     * @param cvalue - The value of the cookie.
     * @param seconds - The number of seconds in the future from the time the cookie is created until it
     * expires.
     */
    setCookie(cname, cvalue, seconds) {
        const d = new Date();
        d.setTime(d.getTime() + seconds);
        let expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    /**
     * Delete a cookie by setting its expiration date to sometime in the past
     * @param cname - The name of the cookie to be deleted.
     * @returns Nothing.
     */
    deleteCookie(cname) {
        return this.setCookie(cname, '', -1);
    }

    /**
     * Given a cookie name, return the value of the cookie
     * @param cname - The name of the cookie.
     * @returns The value of the cookie.
     */
    getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while(c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if(c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }

        return "";
    }

    /**
     * Get the search parameters from a URL
     * @param [url=false] - The URL to parse.
     * @returns An object with the search parameters as keys and their values as values.
     */
    getSearchParams(url = false) {
        let newUrl = false;
        if(url) {
            newUrl = new URL(url);
        }
        newUrl = new URL(location.href);

        if(newUrl.searchParams) {
            let res = {};
            for(let p of newUrl.searchParams) {
                res[p[0]] = p[1];
            }

            return res;
        }

        return [];
    }

    /**
     * It takes a URL and returns the view that corresponds to that URL
     * @param url - The url of the view to fetch.
     * @returns The template.
     */
    async fetchTemplate(url) {
        if(globalThis.views === undefined) {
            globalThis.views = [];

            const result = await fetch(url);
            if(result.status == 200) {
                return result.text();
            } else {
                throw `Can't fetch view, request status ${result.status}`;
            }
        }

        let view = globalThis.views.find(el => el.url == url);
        if(globalThis.views.length > 0 && view) {
            return view;
        } else {
            return '';
        }
    }

   /**
    * The function loads the controllers that are needed for the current route
    * @returns Nothing.
    */
    async loadControllers() {
        this.controllersToLoad = [];
        this.urlConfiguration = [];
        if(Object.keys(this.routing).includes((new URL(location.href)).pathname)) {
            this.urlConfiguration = this.routing[(new URL(location.href)).pathname];
            this.controllersToLoad = this.routing[(new URL(location.href)).pathname].controllers;
        }

        // Parse slug urls
        let currentUrlDetails = (new URL(location.href)).pathname.split('/');
        Object.keys(this.routing).forEach(url => {
            let slugs = url.match(/{.*}+/g);
            if(!slugs) {
                return;
            }

            let urlDetails = url.split('/');
            if(urlDetails.length != currentUrlDetails.length) {
                return;
            }

            if(urlDetails.length != currentUrlDetails.length) {
                return;
            }


            for(let i = 0; i < urlDetails.length; i++) {
                if(urlDetails[i].match(/{.*}+/g) && currentUrlDetails[i] != '') {
                    continue;
                }

                if(urlDetails[i] != currentUrlDetails[i]) {
                    return;
                }
            }

            this.slugData = [];
            this.controllersToLoad = [];
            this.urlConfiguration = this.routing[url];

            if(this.routing[url] && this.routing[url].controllers) {
                this.controllersToLoad = this.routing[url].controllers;
            }

            for(let i = 0; i < urlDetails.length; i++) {
                let slug = urlDetails[i].match(/{.*}+/g);
                if(slug) {
                    let varName = slug[0].replace('{', '').replace('}', '');
                    let value = currentUrlDetails[i];
                    this.slugData[varName] = value;
                }
            }
        });

        if(this.urlConfiguration.redirect) {
            return this.redirect(this.urlConfiguration.redirect, this.getSearchParams());
        }

        if(this.controllersToLoad.length == 0) {
            console.error('Empty controllers for this route');
            // this.show404();
        }

        try {
            if(this.urlConfiguration.template) {
                document.body.innerHTML = await this.fetchTemplate(this.urlConfiguration.template);
            }

            if(this.urlConfiguration.title) {
                this.setTitle(this.urlConfiguration.title);
            }

            if(this.urlConfiguration.metaData) {
                this.urlConfiguration.metaData.forEach(meta => {
                   this.setMetaTag(meta);
                });
            }

            if(this.urlConfiguration.styles) {
                this.urlConfiguration.styles.forEach(style => {
                    this.addStyle(style);
                 });
            }

        } catch(error) {
            console.error(error);
        }

        for(let i = 0; i < this.controllers_configuration.length; i++) {
            let controller = this.controllers_configuration[i];
            if(!this.controllersToLoad.includes(controller.name)) {
                if(controller.load !== undefined && controller.load == true) {
                    this.controllersToLoad.push(controller.name);
                }
            }

            if(controller.name === undefined || controller.url === undefined || !this.controllersToLoad.includes(controller.name)) {
                continue;
            }

            await import(controller.url)
                .then(module => {
                    controller.settings.app = this;
                    controller.settings.name = controller.name;
                    this.controllers[controller.name] = new module.default(controller.settings);
                    this.controllers[controller.name].init();

                    this.searchParams = this.getSearchParams();
                })
                .catch(error => console.error(error));
        }
    }

    /**
     * Set the title of the current page
     * @param title - The title of the page.
     * @returns Nothing is being returned.
     */
    setTitle(title) {
        return document.title = title;
    }

    /**
     * AddStyle() adds a style tag to the head of the document
     * @param style - The URL of the style sheet to add.
     * @returns Nothing.
     */
    addStyle(style) {
        if(typeof style !== 'string') {
            console.error('Incorrect style url');
            return;
        }

        let styleTag = document.createElement('link');
        styleTag['rel'] = 'stylesheet';
        styleTag['href'] = style;
        document.getElementsByTagName('head')[0].appendChild(styleTag);
    }

    /**
     * Create a new meta tag and append it to the head of the document
     * @param meta - A dictionary of meta tags to add to the head of the document.
     */
    setMetaTag(meta) {
        let metaTag = document.createElement('meta');
        for(const [key, value] of Object.entries(meta)) {
            metaTag[key] = value;
        }

        document.getElementsByTagName('head')[0].appendChild(metaTag);
    }

    /**
     * When a view is loaded, the controller is loaded and the view is shown
     * @param controllerName - The name of the controller that was loaded.
     * @returns Nothing.
     */
    viewLoaded(controllerName) {
        if(this.appStarted == true) {
            return;
        }

        if(this.getController(controllerName).showOnLoad) {
            this.getController(controllerName).show();
        } else {
            this.getController(controllerName).hide();
        }
        
        this.viewsLoadedCount++;
        this.onControllerLoaded(controllerName);
        if(this.controllersToLoad.length === this.viewsLoadedCount) {
            if(this.firstLoadElementId) {
                document.getElementById(this.firstLoadElementId).style.display = 'none';
            }
            console.info('All views loaded');
            this.appStarted = true;
            this.startApplication();
        }
    }

    /**
     * This function is called when the controller is loaded
     * @param name - The name of the controller.
     */
    onControllerLoaded(name) {

    }

    /**
     * It redefines the startup function.
     */
    onStartApp() {
        console.info('Redefine startup function');
    }

    /**
     * The `onSocketConnected` function is called when the socket is connected
     */
    onSocketConnected() {
        console.info('Custom callback on socket connected');
    }

    /**
     * When the socket is disconnected, this function is called
     */
    onSocketDisconnected() {
        console.info('Custom callback on socket disconnected');
    }

    /**
     * The `onSocketConnectionError` function is called when the socket connection fails
     */
    onSocketConnectionError() {
        console.info('Custom callback on socket connection Error');
    }

    /**
     * The socket is created and the events are bound
     */
    startApplication() {
        this.socket = undefined;
        this.socketConnected = false;
        
        console.info('Application started');
        this.onStartApp();

        if(this.useSockets && this.socketsURL) {
            this.socket = io(this.socketsURL, this.socketConfigs);
            
            //socket connected
            this.socket.on('connect', () => {
                if(this.useSession) {
                    this.sessionKey = this.getCookie('sessionKey');
                    this.socket.emit('getSession', {sessionKey: this.sessionKey});
                    this.socket.on('getSession', session => {
                        this.session = session;
                        if(session.sessionKey && session.sessionKey !== this.sessionKey) {
                            if(session.liveTime == undefined) {
                                session.liveTime = 1000*60*60*60; // One Hour
                            }

                            this.setCookie('sessionKey', session.sessionKey, session.liveTime);
                            this.sessionKey = session.sessionKey;
                        }

                        if(this.socketConnected != true) {
                            this.socketConnected = true;
                            this.onSocketConnected();
                            this.registerSocketRequests();
                        }
                    });
                } else {
                    this.socketConnected = true;
                    this.onSocketConnected();
                }
            });

            this.socket.on('disconnect', () => {
                this.socketConnected = false;
                this.onSocketDisconnected();
            });

            // On connecton Error
            this.socket.on('connect_error', () => {
                this.socketConnected = false;
                this.onSocketConnectionError();
            });
        }
    }

    /**
     * Register all the socket requests that are defined in the `socketRequests` array
     * @returns The instance of the class.
     */
    registerSocketRequests() {
        if(Array.isArray(this.socketListeners)) {
            this.socketListeners.forEach(req => {
                if(typeof req.callback == 'function') {
                    this.socket.once(req.name, req.callback);
                }
            });
        }

        if(Array.isArray(this.socketRequests)) {
            this.socketRequests.forEach(req => {
                this.socket.emit(req.name, req.data);
            });
        }

        return this;
    }

    /**
     * Add a callback to the socketListeners array
     * @param name - The name of the socket event.
     * @param callback - The function that will be called when the socket receives a message.
     * @returns The socket object.
     */
    addSocketListener(name, callback) {
        if(this.socketListeners === undefined) {
            this.socketListeners = [];
        }

        this.socketListeners.push(
            {
                name: name,
                callback: callback
            }
        );

        return this;
    }

    /**
     * Add a socket request to the queue
     * @param name - The name of the socket request.
     * @param data - The data to be sent to the server.
     * @returns The current instance of the class.
     */
    addSocketRequest(name, data) {
        if(this.socketRequests === undefined) {
            this.socketRequests = [];
        }

        this.socketRequests.push(
            {
                name: name,
                data: data
            }
        );

        return this;
    }

    /**
     * If the socket is not connected, add the request to the socket queue. If the socket is connected,
     * send the request to the socket
     * @param name - The name of the socket event.
     * @param data - The data to be sent to the server.
     * @param callback - The callback function that will be called when the response is received.
     * @returns Nothing.
     */
    request(name, data, callback) {
        if(typeof data === 'object' && data.sessionKey === undefined && this.useSession && this.sessionKey) {
            data.sessionKey = this.sessionKey;
        }

        if(!this.socketConnected) {
            this.addSocketListener(name, callback);
            this.addSocketRequest(name, data);
            console.info('Sockets not registered yet! Added to onConnect');
            return this;
        }

        this.socket.once(name, callback);
        this.socket.emit(name, data);
        return this;
    }

    /**
     * Get the controller with the given name
     * @param name - The name of the controller.
     * @returns The controller object.
     */
    getController(name) {
        return this.controllers[name];
    }

    getControllers() {
        return this.controllers;
    }

    /**
     * Given a route, this function will change the current page to the page specified by the route
     * @param route - The route to change to.
     */
    changePath(route) {
        let url;
        if(!(route instanceof URL)) {
            url = new URL(route, location.href);
        } else {
            url = route;
        }
        
        let searchParams = [];
        url.searchParams.forEach((value, name) => {
            searchParams.push({
                name: name,
                value: value
            });
        });

        let names = [];
        if(typeof this.routing[url.pathname] === 'string') {
            names = this.routing[url.pathname].split(',');
        } else {
            names = this.routing[url.pathname];
        }
        if(url.pathname === undefined) {
            this.show404();
        }

        // Hide all controllers
        // Object.keys(this.controllers).forEach(key => {
        //     this.controllers[key].hide();
        // });

        try {
            names.forEach(name => {
                this.getController(name.replace(/\s/g, '')).show().onLoad(searchParams);
                this.searchParams = searchParams;
                this.pathname = url.pathname;
                this.onPageChange(this.searchParams, this.pathname);
            });
        } catch {
            this.show404();
        }
    }

    onPageChange() {

    }

    /**
     * It shows a 404 error message.
     */
    show404() {
        console.error('This method is for 404 error');
    }

    /**
     * It takes a URL and a list of arguments, and creates a new URL with the arguments appended to the URL
     * @param [url] - The URL to redirect to.
     * @param [args] - An object containing the parameters to be appended to the URL.
     * @returns A boolean value.
     */
    redirect(url = '', args = []) {
        try{
            let newUrl = new URL(url, location.href);
            Object.keys(args).forEach(key => {
                newUrl.searchParams.append(key, args[key]);
            });

            location.href = newUrl.href;
            return true;
        } catch {
            console.error('Error on change page');
            return false;
        }
    }

    onClose() {
       
    }
}   
