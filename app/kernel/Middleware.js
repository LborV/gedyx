class Middleware {
    async beforeRequest(request, socket) {
        console.log("beforeRequest method can be overwritten");
    }

    async afterRequest(response, socket) {
        console.log("afterRequest method can be overwritten");
    }
}

module.exports = Middleware;