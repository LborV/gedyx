class Middleware {
    /**
     * This function is called before the request is sent to the server
     * @param request - The request object.
     * @param socket - the socket that is making the request
     */
    async beforeRequest(request, socket) {
        console.log("beforeRequest method can be overwritten");
    }

    /**
     * This function is called after the request is made
     * @param response - the response object returned by the server.
     * @param socket - the socket that initiated the request
     */
    async afterRequest(response, socket) {
        console.log("afterRequest method can be overwritten");
    }
}

module.exports = Middleware;