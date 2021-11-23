const HttpAction = require('./HttpAction');
globalThis.Middlewares = require('./Middlewares');
const Loader = require('./Loader');

class HttpActions extends Loader {
    constructor(dirName = 'httpActions') {       
        super();
        this.actionList = [];

        return this.load(dirName);
    }
    
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

                let action = require(`../${file}`);
                if(action instanceof HttpAction) {
                    this.actionList.push(action);
                } else {
                    throw 'Incorrect class!';
                }

                return this;
            });
        } catch(e) {
            console.error(e);
        }
    }
}

module.exports = HttpActions;