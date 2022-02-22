const Middleware = require('./Middleware');
class HttpAction {
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
        this.middlewaresBefore = middlewaresBefore;
        this.middlewaresAfter = middlewaresAfter;

        if(server && typeof server == 'function') {
            this.server = server;

            if(method) {
                if(typeof method === 'string') {
                    this.registerMethod(method, route);
                } else if(Array.isArray(method)){                    
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
                this.requestIn(req, res)
            });
       }
    }

    /**
     * This function is called when a request is made to the server. 
     * It takes the data from the request and passes it to the request function. 
     * It then takes the response from the request function and passes it to the response function
     * @param data - The data that will be sent to the server.
     * @param response - The response object that will be returned to the client.
     * @returns The response.
     */
    async requestIn(data, response) {
        this.res = response;        
        
        for(let i = 0; i < this.middlewaresBefore.length; i++) {
            let middleware = this.middlewaresBefore[i];
            if(!(middleware instanceof Middleware)) {
                throw 'Middleware should extend Middleware class!';
            }

            data = await middleware.beforeRequest(data);
        }

        return this.response(await this.request(data));
    }

  /**
   * The request method returns the data object
   * @param data - The data to be sent to the server.
   * @returns The data that was passed in.
   */
    async request(data) {
        console.log('Request method can be overwritten');
        return data;
    }

    /**
     * It takes the data from the request and passes it to all the middlewares that are after the request
     * @param data - The data that will be sent to the client.
     * @returns Nothing.
     */
    async response(data) {
        for(let i = 0; i < this.middlewaresAfter.length; i++) {
            let middleware = this.middlewaresAfter[i];

            if(!(middleware instanceof Middleware)) {
                throw 'Middleware should extend Middleware class!';
            }

            data = await middleware.afterRequest(data);
        }

        return this.res.send(data);
    }
}

module.exports = HttpAction;