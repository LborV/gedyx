const Loader = require('gedyx-loader');
const Middleware = require('gedyx-middleware');
class Middlewares extends Loader {
    /**
     * Loads all the middlewares in the middlewares directory
     * @param [dirName=middlewares] - The directory name where the middleware files are located.
     */
    constructor(dirName = 'middlewares', namespace = undefined) {
        super();

        this.namespace = namespace;
        if(!this.namespace) {
            this.namespace = this;
        }

        this.load(dirName);
    }

    /**
     * It loads all the files in the given directory and checks if they are middlewares. If they are, they
     * are loaded into the global object
     * @param dirName - The directory name where the middleware files are located.
     */
    load(dirName) {
        try {
            let normalizedPath = require("path").join('', dirName);
            this.getFiles(normalizedPath).forEach((file) => {
                if(!file.includes('.js')) {
                    return;
                }

                let middleware = require(file);
                if(middleware instanceof Middleware) {
                    let middlewareName = file.split('/').pop().replace('.js', '');
                    this.namespace[middlewareName] = middleware;
                } else {
                    throw 'Incorrect class!';
                }
            });
        } catch(e) {
            throw e;
        }
    }
}

module.exports = Middlewares;
