const Model = require('./model/Model');
class Models {
    constructor() {
        try{
            let normalizedPath = require("path").join('', "models");
            require("fs").readdirSync(normalizedPath).forEach((file) => {
                if(!file.includes('.js')) {
                    return;
                }

                let model = require(`../models/${file}`);
                if(model instanceof Model) {
                    let modelName = file.replace('.js', '');
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

module.exports = Models;
