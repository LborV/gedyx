const Loader = require('gedyx-loader');
const QueryBuilder = require('./queryBuilder/QueryBuilder');
class Models extends Loader {
    /**
     * It creates a new instance of the class and loads the models from the models directory.
     * @param [dirName=models] - The directory name where the models are stored.
     */
    constructor(dirName = 'models') {
        super();
        this.load(dirName);
    }

    /**
     * Loads all the files in the specified directory and instantiates the QueryBuilder class
     * @param dirName - The directory name where the models are located.
     */
    load(dirName) {
        try {
            let normalizedPath = require("path").join('', dirName);
            this.getFiles(normalizedPath).forEach((file) => {
                if(!file.includes('.js')) {
                    return;
                }

                let model = require(`../${file}`);
                if(model instanceof QueryBuilder) {
                    let modelName = file.split('/').pop().replace('.js', '');
                    globalThis[modelName] = model;
                } else {
                    throw 'Incorrect class!';
                }
            });
        } catch(e) {
            console.error(e);
        }
    }
}

module.exports = Models;
