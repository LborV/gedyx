/* The Actions class is a class that is used to load and manage all the actions that are in the actions
folder */
const Action = require('gedyx-action');
const Middlewares = require('gedyx-middleware-manager');
const Loader = require('gedyx-loader');

class Actions extends Loader {
    /**
     * It creates an instance of the Action class.
     * @param configs - The configs object passed to the constructor.
     * @param [dirName=actions] - The name of the directory where the actions are located.
     * @returns Nothing.
     */
    constructor(configs, dirName = 'actions', namespace = undefined) {
        super();

        if(configs.io) {
            if(configs.useSession == true) {
                this.useSession = true;
                this.sessionConfigs = configs.session;
            }

            this.io = configs.io;
        }

        this.namespace = namespace;
        if(!this.namespace) {
            this.namespace = this;
        }

        this.actionList = [];
        this.load(dirName);
    }

    /**
     * It creates a new instance of the Sessions class and calls the init method on it.
     * @returns The listener is being returned.
     */
    async init() {
        if(this.sessionConfigs && this.useSession) {
            const Sessions = require('gedyx-session');
            this.sessions = await (new Sessions()).init(this.sessionConfigs);
        }

        return this.listener();
    }

    /**
     * It loads all the files from the given directory and then it creates an instance of the Action class
     * for each of them.
     * @param dirName - The directory name where the actions are located.
     */
    load(dirName) {
        try {
            if(this.namespace.MiddlewaresPool === undefined) {
                this.namespace.MiddlewaresPool = new Middlewares();
            }

            let normalizedPath = require("path").join('', dirName);
            this.getFiles(normalizedPath).forEach((file) => {
                if(!file.includes('.js')) {
                    return;
                }

                let action = require(file).setParent(this);
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
     * A callback function that is called when the connection is established.
     */
    onConnect() {
        throw "onConnect method can be overwritten";
    }

    /**
     * The onDisconnect() method is called when the client disconnects from the server
     */
    onDisconnect() {
        throw "onDisconnect method can be overwritten";
    }

    /**
     * The function takes in a socket and a sessionKey. It then creates a session object and sets it to the
     * socket.session property
     * @param socket - The socket object that is being connected to.
     * @param sessionKey - The session key to be used.
     */
    async initSession(socket, sessionKey) {
        socket.session = await this.sessions.get(sessionKey);
        socket.emit('getSession', { sessionKey: socket.session.sessionKey, liveTime: socket.session.liveTime });
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
            var data = {};
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
    }

    /**
     * When a client connects, the server will call the onConnect function
     * @returns Nothing.
     */
    listener() {
        if(typeof this.io?.on !== 'function') {
            return this;
        }

        this.io.on('connection', (socket) => {
            this.onConnect(socket);

            if(this.useSession) {
                socket.on('getSession', async session => {
                    await this.initSession(socket, session?.sessionKey);
                });
            }

            for(let actionName in this.actionList) {
                socket.on(actionName, async (data) => {
                    this.actionList[actionName].requestIn(data, socket);
                });
            }

            socket.on('disconnect', () => {
                this.onDisconnect(socket);
                socket.disconnect();
                socket.removeAllListeners();
                socket = null;
            });
        });

        return this;
    }

    /**
     * If the action name is in the action list, then call the action's requestIn function
     * @param actionName - The name of the action to be called.
     * @param data - The data that will be sent to the server.
     * @param [socket] - The socket that is calling the action.
     * @returns The action object.
     */
    async call(actionName, data, socket = undefined) {
        if(actionName in this.actionList) {
            return await this.actionList[actionName].requestIn(data, socket);
        }

        return this;
    }
}

module.exports = Actions;