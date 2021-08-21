const Loader = require('./Loader');
const Middleware = require('./Middleware');
class Middlewares extends Loader {
    constructor() {
        super();
        this.load();
    }

    load(dirName = 'middlewares') {
        try{
            let normalizedPath = require("path").join('', dirName);
            this.getFiles(normalizedPath).forEach((file) => {
                if(!file.includes('.js')) {
                    return;
                }

                let model = require(`../${file}`);
                if(model instanceof Middleware) {
                    let modelName = file.split('/').pop().replace('.js', '');
                    globalThis[modelName] = model;
                } else {
                    throw 'Inccorect class!';
                }
            });
        } catch(e) {
            console.error(e);
        }
    }
}

module.exports = Middlewares;
