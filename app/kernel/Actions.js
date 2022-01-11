const Action = require('./Action');
globalThis.Middlewares = require('./Middlewares');
const Loader = require('./Loader');

/**
 * Automaticaly load and construct "Actions" 
 */
class Actions extends Loader {
    /**
     * 
     * @param {Object} configs 
     * @param {String} dirName 
     * @returns {Object}
     */
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
    
    /**
     * 
     * @param {String} dirName 
     */
    load(dirName) {
        try {
            if(globalThis.MiddlewaresPool === undefined) {
                globalThis.MiddlewaresPool = new Middlewares();
            }

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

    /**
     * Should be redefined
     */
    onConnect() {
        console.log("onConnect method can be overwritten");
    }

    /**
     * Should be redefined
     */
    onDisconnect() {
        console.log("onDisconnect method can be overwritten");
    }

    /**
     * 
     * @returns {Object}
     */
    listener() {
        this.io.on('connection', (socket) => {
            this.onConnect(socket);

            if(this.useSession) {
                socket.on('getSession', async session => {
                    socket.session = await this.sessions.get(session?.sessionKey);
                    socket.emit('getSession', {sessionKey: socket.session.sessionKey, liveTime: socket.session.liveTime});
                
                    socket.session.set = async (key, value) => {
                        return await this.sessions.setValue(socket.session.sessionKey, key, value)
                    }

                    socket.session.get = async (key) => {
                        let session = await this.sessions.get(socket.session.sessionKey);

                        if(key === undefined) {
                            return session;
                        }
                        
                        return session[key];
                    }

                    socket.session.delete = async (_key) => {
                        var data = [];
                        for(const [key, value] of Object.entries(socket.session)) {
                            if(value.id != _key) {
                                data[key] = value;
                            }
                        }

                        return await this.sessions.set(socket.session.sessionKey, data);
                    }

                    socket.session.forget = async () => {
                        return await this.sessions.set(socket.session.sessionKey, {});
                    }

                });
            }

            for(let actionName in this.actionList) {
                socket.on(actionName, (data) => {this.actionList[actionName].requestIn(data, socket);});
            }

            socket.on('disconnect', () => {
                this.onDisconnect(socket);
                try {
                    socket.disconnect();
                    socket.removeAllListeners();
                    socket = null;
                } catch(err) {
                    console.error(err);
                }
            });
        });

        return this;
    }

    /**
     * 
     * @param {String} actionName 
     * @param {Any} data 
     * @param {Object} socket 
     * @returns {Object}
     */
    async call(actionName, data, socket = undefined) {
        if(actionName in this.actionList) {
            return await this.actionList[actionName].requestIn(data, socket);
        }

        return this;
    }
}

module.exports = Actions;