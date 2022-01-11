const Middleware = require('./Middleware');
/**
 * This class will be inherited by your actions, normally you only need to override only the [request]{@link Action#request} request method
 */
class Action {
    /**
     * Constructor of action
     * @param {String} actionName - Event name
     * @param {Array} middlewaresBefore - Array of middlewares that will be executed before call this method [More about middlewares]{@tutorial Middlewares} 
     * @param {Array} middlewaresAfter - Array of middlewares that will be executed after call this method [More about middlewares]{@tutorial Middlewares}
     * @returns {Object} - This instance to provide fluent interface
     */
    constructor(actionName, middlewaresBefore = [], middlewaresAfter = []) {
        this.actionName = actionName;
        this.middlewaresBefore = middlewaresBefore;
        this.middlewaresAfter = middlewaresAfter;
        return this;
    }

    /**
     * Sets parent of action
     * @param {Actions} parent
     * @returns {Object} - This instance to provide fluent interface
     */
    setParent(parent) {
        this.parent = parent;
        return this;
    }

    /**
     * Returns event name
     * @returns {String}
     */
    getName() {
        return this.actionName;
    }

    /**
     * Executes when event called
     * @param {Any} data
     * @param {Socket} socket - [Socket io]{@link https://socket.io} socket
     */
    async requestIn(data, socket) {
        this.socket = socket;
        
        for(let i = 0; i < this.middlewaresBefore.length; i++) {
            let middleware = this.middlewaresBefore[i];
            if(!(middleware instanceof Middleware)) {
                throw 'Middleware should extend Middleware class!';
            }

            data = await middleware.beforeRequest(data, this.socket);
        }

        this.request(data);
    }

    /**
     * Request method should be overwritten
     * @param {Any} data 
     */
    async request(data) {
        console.log('Request method can be overwritten');
    }

    /**
     * Call event on actionName passed in constructor
     * @param {Any} data 
     * @return {Any} - data sended to event(After {@tutorial Middlewares})
     */
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

    /**
     * Call [Socket io]{@link https://socket.io} broadcast method
     * @param {Any} data 
     */
    broadcast(data) {
        data = this.response(data);
        this.socket.broadcast.emit(this.actionName, data);

        return data;
    }

    /**
     * Call another event defined on same parent
     * @param {String} actionName 
     * @param {Any} data 
     * @returns {Any}
     */
    async call(actionName, data) {
        if(actionName === this.actionName) {
            return {};
        }
        return await this.parent.call(actionName, data, this.socket);
    }
}

module.exports = Action;