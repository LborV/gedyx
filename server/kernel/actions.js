class actions {
    constructor(configs) {        
        if(!configs.actionList || !configs.io) {
           return; 
        }

        this.actionList = [];
        for(let key in configs.actionList) {
            let action = require(`../actions/${configs.actionList[key]}`);
            this.actionList.push({key: action});
        }
        this.io = configs.io;

        return this.listener();
    }

    onConnect() {
        console.log("onConnect method can be overwriten");
    }

    onDisconnect() {
        console.log("onDisconnect method can be overwriten");
    }

    listener() {
        this.io.on('connection', (socket) => {
            this.onConnect(socket);

            this.actionList.forEach(action => {
                socket.on(action.methodName, (data) => {action.requestIn(data, socket);});
            });

            socket.on('disconnect', () => {
                this.onDisconnect(socket);
            });
        });

        return this;
    }
}

module.exports = actions;