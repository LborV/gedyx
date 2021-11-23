class Middleware {
    async beforeRequest(request) {
        console.log("beforeRequest method can be overwritten");
    }

    async afterRequest(response) {
        console.log("afterRequest method can be overwritten");
    }
}

module.exports = Middleware;