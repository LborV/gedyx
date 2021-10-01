class Middleware {
    beforeRequest(request) {
        console.log("beforeRequest method can be overwritten");
    }

    afterRequest(response) {
        console.log("afterRequest method can be overwritten");
    }
}

module.exports = Middleware;