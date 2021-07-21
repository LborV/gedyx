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

    requestIn(data, socket) {
        this.socket = socket;
        
        this.middlewaresBefore.forEach(middleware => {
            if(!(middleware instanceof Middleware)) {
                throw 'Middleware should extend Middleware class!';
            }

            data = middleware.beforeRequest(data);
        });

        this.request(data);
    }

    request(data) {
        console.log('Request method can be overwriten');
    }

    response(data) {
        this.middlewaresAfter.forEach(middleware => {
            if(!(middleware instanceof Middleware)) {
                throw 'Middleware should extend Middleware class!';
            }

            data = middleware.afterRequest(data);
        });
        this.socket.emit(this.actionName, data);
    }

    broadcast(data) {
        this.socket.broadcast.emit(this.actionName, data);
    }

    call(actionName, data) {
        return this.parent.call(actionName, data, this.socket);
    }
}

module.exports = Action;