class Application {
    constructor(configuration) {
        this.controllers = {};    
        this.useSockets = false;
        this.socketsURL = false;

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

        if(configuration.useSockets !== undefined && configuration.socketsURL !== undefined) {
            this.useSockets = configuration.useSockets;
            this.socketsURL = configuration.socketsURL;
        }

        if(configuration.controllers !== undefined) {
            this.controllers_configuration = configuration.controllers;
        }

        try {
        this.loadControllers()
            .then(() => this.startApplication())
            .catch(() => {console.error('Failed to start application!');});
            return this;
        } catch {
            return false;
        }
    }

    async loadControllers() {
        for(let i = 0; i < this.controllers_configuration.length; i++) {
            let controller = this.controllers_configuration[i];
            if(controller.name === undefined || controller.url === undefined) {
                continue;
            }

            await import(controller.url)
                .then(module => {
                    this.controllers[controller.name] = new module.default(controller.settings);
                })
                .catch(() => {
                    console.error(`Can't load '${controller.name}' module`);
                    throw `Can't load '${controller.name}' module`;
                });
        }
    }

    startApplication(callback = () => {console.log('Redifine startup function')}) {
        this.socket = undefined;
        if(this.useSockets && this.socketsURL) {
            this.socket = io(this.socketsURL);
        }
        
        callback();
        console.log('Application started');

        //Redirect on page by url
        this.changePage(window.location.href);
    }

    getController(name) {
        return this.controllers[name];
    }

    changePath(route) {
        let url = new URL(route, location.href);
        let searchParams = [];
        url.searchParams.forEach((value, name) => {
            searchParams.push({
                name: name,
                value: value
            });
        })

        let names = [];
        if(typeof this.routing[url.pathname] === 'string') {
            names = this.routing[url.pathname].split(',');
        } else {
            names = this.routing[url.pathname];
        }
        if(url.pathname === undefined) {
            return false;
        }

        Object.keys(this.controllers).forEach(key => {
            this.controllers[key].hide();
        });

        try {
            names.forEach(name => {
                this.getController(name.replace(/\s/g, '')).onLoad(searchParams);
            });
        } catch {
            this.show404();
        }
    }

    show404() {
        console.error('This method is for 404 error');
    }

    changePage(url = '', title = '') {
        try{
            this.changePath(url);
            history.pushState(null, title, url);
            return true;
        } catch {
            return false;
        }
    }
}   
