class Action {
    constructor(actionName) {
        this.actionName = actionName;
        return this;
    }

    setParent(parent) {
        this.parent = parent;
        return this;
    }

    getName() {
        return this.actionName;
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

    call(actionName, data) {
        return this.parent.call(actionName, data, this.socket);
    }
}

module.exports = Action;