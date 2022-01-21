const Loader = require('./Loader');
const Middleware = require('./Middleware');
class Middlewares extends Loader {
    constructor(dirName = 'middlewares') {
        super();
        this.load(dirName);
    }

    load(dirName) {
        try{
            globalThis['_middlewares'] = {};
            let normalizedPath = require("path").join('', dirName);
            this.getFiles(normalizedPath).forEach((file) => {
                if(!file.includes('.js')) {
                    return;
                }

                let middleware = require(`../${file}`);
                if(middleware instanceof Middleware) {
                    let middlewareName = file.split('/').pop().replace('.js', '');
                    globalThis['_middlewares'][middlewareName] = middleware;
                } else {
                    throw 'Incorrect class!';
                }
            });
        } catch(e) {
            console.error(e);
        }
    }
}

module.exports = Middlewares;
