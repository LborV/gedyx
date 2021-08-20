class Middleware {
    beforeRequest(request) {
        console.log("beforeRequest method can be overwriten");
    }

    afterRequest(response) {
        console.log("afterRequest method can be overwriten");
    }
}

module.exports = Middleware;