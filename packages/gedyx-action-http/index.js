const Action = require('gedyx-action');
class ActionHttp extends Action {
    /**
     * It creates a new instance of the class.
     * @param route - The route to be registered.
     * @param server - The server object that will be used to register the route.
     * @param [method=get] - The HTTP method to register the route with.
     * @param [middlewaresBefore] - An array of middlewares that will be executed before the route.
     * @param [middlewaresAfter] - An array of middlewares that will be executed after the route is
     * executed.
     * @returns The instance of the class.
     */
    constructor(route, server, method = 'get', middlewaresBefore = [], middlewaresAfter = []) {
        super(route, middlewaresBefore, middlewaresAfter);

        if(server && typeof server == 'function') {
            this.server = server;

            if(method) {
                if(typeof method === 'string') {
                    this.registerMethod(method, route);
                } else if(Array.isArray(method)) {
                    method.forEach(m => {
                        this.registerMethod(m, route);
                    });
                }
            }
        }

        return this;
    }

    /**
     * It takes a method and a route and registers it to the server
     * @param method - The HTTP method that you want to register.
     * @param route - The route that the method will be listening on.
     * @returns Nothing.
     */
    registerMethod(method, route) {
        const allowedMethods = [
            'checkout',
            'copy',
            'delete',
            'get',
            'head',
            'lock',
            'merge',
            'mkactivity',
            'mkcol',
            'move',
            'm-search',
            'notify',
            'options',
            'patch',
            'post',
            'purge',
            'put',
            'report',
            'search',
            'subscribe',
            'trace',
            'unlock',
            'unsubscribe',
        ];

        if(method === '*') {
            allowedMethods.forEach(method => {
                this.registerMethod(method, route)
            });

            return;
        }

        if(allowedMethods.includes(method, route)) {
            this.server[method](route, async (req, res) => {
                this.method = method;
                let data = await this.requestIn(req, res);
                return await res.send(data);
            });
        }
    }
}

module.exports = ActionHttp;