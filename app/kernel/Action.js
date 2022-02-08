const Middleware = require('./Middleware');
class Action {
    constructor(actionName, middlewaresBefore = [], middlewaresAfter = []) {
        this.actionName = actionName;
        this.middlewaresBefore = middlewaresBefore;
        this.middlewaresAfter = middlewaresAfter;
        return this;
    }

    setParent(parent) {
        this.parent = parent;
        return this;
    }

    getName() {
        return this.actionName;
    }

    async requestIn(data, socket) {
        this.socket = socket;

        if(this.parent.useSession && this.socket.session === undefined && data.sessionKey) {
            await this.parent.initSession(socket, data?.sessionKey);
        }
        
        for(let i = 0; i < this.middlewaresBefore.length; i++) {
            let middleware = this.middlewaresBefore[i];
            if(!(middleware instanceof Middleware)) {
                throw 'Middleware should extend Middleware class!';
            }

            data = await middleware.beforeRequest(data, this.socket);
        }

        this.request(data);
    }

    async request(data) {
        console.log('Request method can be overwritten');
    }

    async response(data) {
        for(let i = 0; i < this.middlewaresAfter.length; i++) {
            let middleware = this.middlewaresAfter[i];

            if(!(middleware instanceof Middleware)) {
                throw 'Middleware should extend Middleware class!';
            }

            data = await middleware.afterRequest(data, this.socket);
        }

        this.socket.emit(this.actionName, data);

        return data;
    }

    broadcast(data) {
        data = this.response(data);
        this.socket.broadcast.emit(this.actionName, data);

        return data;
    }

    async call(actionName, data) {
        if(actionName === this.actionName) {
            return {};
        }
        return await this.parent.call(actionName, data, this.socket);
    }
}

module.exports = Action;