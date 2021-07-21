const Middleware = require('./Middleware');
class Middlewares {
    constructor() {
        try{
            let normalizedPath = require("path").join('', "middlewares");
            require("fs").readdirSync(normalizedPath).forEach((file) => {
                if(!file.includes('.js')) {
                    return;
                }

                let model = require(`../middlewares/${file}`);
                if(model instanceof Middleware) {
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

module.exports = Middlewares;
