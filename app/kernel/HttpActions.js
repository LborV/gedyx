const HttpAction = require('./HttpAction');
globalThis.Middlewares = require('./Middlewares');
const Loader = require('./Loader');

class HttpActions extends Loader {
    /**
     * The constructor function creates an instance of the class and calls the load function
     * @param [dirName=httpActions] - The name of the directory where the actions are stored.
     * @returns The return value is the httpActions object.
     */
    constructor(dirName = 'httpActions') {       
        super();
        this.actionList = [];

        return this.load(dirName);
    }
    
    /**
     * It loads all the files from the given directory and then it checks if the file is a JavaScript
     * file. If it is, it will load the file and then it will check if the file is an instance of
     * HttpAction. If it is, it will add the action to the action list.
     * @param dirName - The directory name where the actions are located.
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