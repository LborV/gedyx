const Action = require('./Action');
globalThis.Middlewares = require('./Middlewares');
const Loader = require('./Loader');

class Actions extends Loader {
    constructor(configs, dirName = 'actions') {       
        super();

        if(!configs.io) {
            return; 
         }
 
        this.actionList = [];
        this.load(dirName);

        if(configs.useSession == true) {
            this.useSession = true;
            const Sessions = require('./Sessions');
            this.sessions = new Sessions(configs.session);
        }

        this.io = configs.io;
        return this.listener();
    }
    
    load(dirName) {
        try {
            globalThis.MiddlewaresPool = new Middlewares();

            let normalizedPath = require("path").join('', dirName);         
            this.getFiles(normalizedPath).forEach((file) => {
                if(!file.includes('.js')) {
                    return;
                }

                let action = require(`../${file}`).setParent(this);
                if(action instanceof Action) {
                    let actionName = action.getName();
                    this.actionList[actionName] = action;
                } else {
                    throw 'Incorrect class!';
                }
            });
        } catch(e) {
            console.error(e);
        }
    }

    onConnect() {
        console.log("onConnect method can be overwritten");
    }

    onDisconnect() {
        console.log("onDisconnect method can be overwritten");
    }

    listener() {
        this.io.on('connection', (socket) => {
            this.onConnect(socket);

            if(this.useSession) {
                socket.on('getSession', async session => {
                    socket.session = await this.sessions.get(session?.sessionKey);
                    socket.emit('getSession', {sessionKey: socket.session.sessionKey, liveTime: socket.session.liveTime});
                });
            }

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