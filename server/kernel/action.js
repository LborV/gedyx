class action {
    constructor(actionName) {
        this.actionName = actionName;
        return this;
    }

    requestIn(data, socket) {
        this.socket = socket;
        this.request(data);
    }

    request(data) {
        console.log('Request method can be overwriten');
    }

    response(data) {
        this.socket.emit(this.actionName, data);
    }

    broadcast(data) {
        this.socket.broadcast.emit(this.actionName, data);
    }
}

module.exports = action;