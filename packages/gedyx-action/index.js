const Middleware = require('gedyx-middleware');
class Action {
    /**
     * @param actionName - The name of the action.
     * @param [middlewaresBefore] - An array of middleware functions that will be executed before the
     * action is called.
     * @param [middlewaresAfter] - An array of middleware functions that will be executed after the action
     * is executed.
     * @returns The object.
     */
    constructor(actionName, middlewaresBefore = [], middlewaresAfter = []) {
        this.actionName = actionName;
        this.middlewaresBefore = middlewaresBefore;
        this.middlewaresAfter = middlewaresAfter;
        return this;
    }

    /**
     * Set the parent of this object to the given parent
     * @param parent - The parent of the current node.
     * @returns Nothing.
     */
    setParent(parent) {
        this.parent = parent;
        return this;
    }

    /**
     * Get the name of the action
     * @returns The action name.
     */
    getName() {
        return this.actionName;
    }

    /**
     * This function is called when a request is received from the client. 
     * It will run all the middlewares before the request is processed.
     * @param data - The data that was sent by the client.
     * @param socket - The socket that the request came from.
     */
    async requestIn(data, socket = null) {
        for(let i = 0; i < this.middlewaresBefore.length; i++) {
            let middleware = this.middlewaresBefore[i];
            if(!(middleware instanceof Middleware)) {
                throw 'Middleware should extend Middleware class!';
            }

            data = await middleware.beforeRequest(data, this.socket);
        }

        return this.response(await this.request(data));
    }

    /**
     * A function that can be overwritten.
     * @param data - The data to be sent to the server.
     */
    async request(data) {
        throw 'Request method can be overwritten';
    }

    /**
     * It calls all the middlewares after the request, and then emits the response to the client
     * @param data - The data that will be sent to the client.
     * @returns data
     */
    async response(data) {
        for(let i = 0; i < this.middlewaresAfter.length; i++) {
            let middleware = this.middlewaresAfter[i];

            if(!(middleware instanceof Middleware)) {
                throw 'Middleware should extend Middleware class!';
            }

            data = await middleware.afterRequest(data);
        }

        return data;
    }
}

module.exports = Action;