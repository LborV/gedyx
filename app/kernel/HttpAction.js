const Middleware = require('./Middleware');
class HttpAction {
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

    async request(data) {
        console.log('Request method can be overwritten');
        return data;
    }

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