const Action = require('./Action');
globalThis.Middlewares = require('./Middlewares');
/**
 * Этот класс вызывается автоматически один раз при запуске приложения. В конструкторе он создат глабальные объекты
 * дочерних классов {@link /server/kernel/Action.md|Action} которые находятся в папке
 * <pre><code>
 * /server/actions
 * </code></pre>
 * и глобальные объекты дочерних классов Middleware которые находиятся в папке 
 * <pre><code>
 * /server/middlewares
 * </code></pre>
 * 
 * 
 * @param {Object} configs конфишурация
 */
class Actions {
    constructor(configs) {        
        if(!configs.io) {
           return; 
        }

        this.actionList = [];
        
        try {
            globalThis.MiddlewaresPool = new Middlewares();

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