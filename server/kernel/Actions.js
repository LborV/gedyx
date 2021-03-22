const Action = require('./Action');
class Actions {
    constructor(configs) {        
        if(!configs.io) {
           return; 
        }

        this.actionList = [];
        
        try {
            let normalizedPath = require("path").join('', "actions");
            require("fs").readdirSync(normalizedPath).forEach((file) => {
                if(!file.includes('.js')) {
                    return;
                }

                let action = require(`../actions/${file}`).setParent(this);
                if(action instanceof Action) {
                    let actionName = action.getName();
                    this.actionList[actionName] = action;
                } else {
                    throw 'Inccorect class!';
                }
            });
        } catch(e) {
            console.error(e);
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

            for(let actionName in this.actionList) {
                socket.on(actionName, (data) => {this.actionList[actionName].requestIn(data, socket);});
            }

            socket.on('disconnect', () => {
                this.onDisconnect(socket);
            });
        });

        return this;
    }

    call(actionName, data, socket = undefined) {
        if(actionName in this.actionList) {
            return this.actionList[actionName].requestIn(data, socket);
        }

        return this;
    }
}

module.exports = Actions;