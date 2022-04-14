const Middleware = require('gedyx-middleware');
const Action = require('gedyx-action');
class ActionSocket extends Action {
    /**
     * This function is called when a request is received from the client. 
     * It will run all the middlewares before the request is processed.
     * @param data - The data that was sent by the client.
     * @param socket - The socket that the request came from.
     */
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

        return this.response(await this.request(data));
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

            data = await middleware.afterRequest(data, this.socket);
        }

        this.socket.emit(this.actionName, data);

        return data;
    }

    /**
     * Send a message to all connected clients
     * @param data - The data to be sent to the client.
     * @returns data.
     */
    broadcast(data) {
        data = this.response(data);
        this.socket.broadcast.emit(this.actionName, data);

        return data;
    }

    /**
     * It calls the parent's call function with the action name and data
     * @param actionName - The name of the action to call.
     * @param data - The data that was sent with the action.
     * @returns The return value of the call method is an object that contains the data that was returned
     * by the action.
     */
    async call(actionName, data) {
        if(actionName === this.actionName) {
            return {};
        }
        return await this.parent.call(actionName, data, this.socket);
    }
}

module.exports = ActionSocket;