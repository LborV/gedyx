const Loader = require('./Loader');
const QueryBuilder = require('./queryBuilder/QueryBuilder');
class Models extends Loader {
    constructor() {
        super();
        this.load();
    }

    load(dirName = 'models') {
        try{
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
