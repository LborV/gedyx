class Application {
    constructor(configuration) {
        this.controllers = {};    
        this.useSockets = false;
        this.socketsURL = false;
        this.useSession = true;
        this.appStarted = false;
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

        this.useLocalStorage = configuration.useLocalStorage ?? true;
        if(this.useLocalStorage) {
            globalThis.views = JSON.parse(localStorage.getItem('views')) ?? [];
            window.onbeforeunload = () => {
                this.onClose();
                localStorage.setItem('views', JSON.stringify(globalThis.views ?? []));
            };
        }

        if(configuration.useSockets !== undefined && configuration.socketsURL !== undefined) {
            this.useSockets = configuration.useSockets;
            this.socketsURL = configuration.socketsURL;
        }

        if(configuration.controllers !== undefined) {
            this.controllers_configuration = configuration.controllers;
        }

        try {
        this.loadControllers()
            // .then(() => this.startApplication())
            .then(() => {
                console.log('Waiting while views be loaded');
                window.onpopstate = (event) => this.changePath(event.target.location.href);
            })
            .catch(error => console.error(error));
            return this;
        } catch {
            return false;
        }
    }

    setCookie(cname, cvalue, seconds) {
        const d = new Date();
        d.setTime(d.getTime() + seconds);
        let expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    deleteCookie(cname) {
        return this.setCookie(cname, '', -1);
    }

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
            this.controllersToLoad = this.routing[url].controllers;
            this.urlConfiguration = this.routing[url];

            for(let i = 0; i < urlDetails.length; i++) {
                let slug = urlDetails[i].match(/{.*}+/g);
                if(slug) {
                    let varName = slug[0].replace('{', '').replace('}', '');
                    let value = currentUrlDetails[i];
                    this.slugData[varName] = value;
                }
            }
        });

        if(this.controllersToLoad.length == 0) {
            this.show404();
        }

        try {
            document.body.innerHTML = await this.fetchTemplate(this.urlConfiguration.template);
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

                    this.searchParams = this.getSearchParams();
                })
                .catch(error => console.error(error));
        }
    }

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
            console.log('All views loaded');
            this.appStarted = true;
            this.startApplication();
        }
    }

    onControllerLoaded(name) {

    }

    onStartApp() {
        console.log('Redifine startup function');
    }

    onSocketConnected() {
        console.log('Custom callback on socket connected');
    }

    onSocketDisconnected() {
        console.log('Custom callback on socket disconnected');
    }

    startApplication() {
        this.socket = undefined;
        this.socketConnected = false;
        
        console.info('Application started');
        this.onStartApp();

        //Redirect on page by url
        // this.changePage(window.location.href);

        if(this.useSockets && this.socketsURL) {
            this.socket = io(this.socketsURL);
            
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
                        }

                        if(this.socketConnected != true) {
                            this.socketConnected = true;
                            this.onSocketConnected();
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
        }
    }

    getController(name) {
        return this.controllers[name];
    }

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

    show404() {
        console.error('This method is for 404 error');
    }

    changePage(url = '', args = [], title = '') {
        // try{
        //     let newUrl = new URL(url, location.href);
        //     args.forEach(arg => {
        //         newUrl.searchParams.append(arg.name, arg.value);
        //     });

        //     this.changePath(newUrl);
        //     history.pushState(null, title, newUrl);
        //     return true;
        // } catch {
        //     console.error('Error on change page');
        //     return false;
        // }

        try{
            let newUrl = new URL(url, location.href);
            args.forEach(arg => {
                newUrl.searchParams.append(arg.name, arg.value);
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
