class Middleware {
    /**
     * This function is called before the request is sent to the server
     * @param request - The request object.
     * @param socket - the socket that is making the request
     */
    async beforeRequest(request, socket) {
        throw "beforeRequest method can be overwritten";
    }

    setParent(parent) {
        this.parent = parent;
    }

    /**
     * This function is called after the request is made
     * @param response - the response object returned by the server.
     * @param socket - the socket that initiated the request
     */
    async afterRequest(response, socket) {
        throw "afterRequest method can be overwritten";
    }
}

module.exports = Middleware;