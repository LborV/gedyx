/**
 * 
 */
class Middleware {
    /**
     * 
     * @param {Any} request 
     * @param {Socket} socket 
     */
    async beforeRequest(request, socket) {
        console.log("beforeRequest method can be overwritten");
    }

    /**
     * 
     * @param {Any} request 
     * @param {Socket} socket 
     */
    async afterRequest(response, socket) {
        console.log("afterRequest method can be overwritten");
    }
}

module.exports = Middleware;