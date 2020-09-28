const fs = require("fs");

function main(arg) {
    if(arg.length <= 2) {
        return 'To few arguments';
    }

    if(!checkDir()) {
        return './models directory can\'t be found';
    }

    arg.splice(0, 2);

    arg.forEach(modelName => {
        fs.open('./models/' + modelName + '.js', 'wx+', (err, file) => {
            if(err) {
                console.log('Something wrong with ./models/' + modelName + '.js file, check it out');
                return;
            }

            let model_name = modelName.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g).map(x => x.toLowerCase()).join('_');

            let buf = Buffer.from(makeFileContent(modelName, model_name));
            let len = buf.length;

            fs.write(file, buf, 0, len, 0, (err) => {
                if(err) {
                    console.log('Can\'t write content to file ./models/' + modelName + '.js');
                    return;
                }

                console.log('File ./models/' + modelName + '.js created!');
                includeGlobalyModel(modelName, model_name);
            });
        });
    });
}

function makeFileContent(modelName, model_name) {
    return `
//This file was automaticaly generated
//Feel free to edit :)

var model = require('../kernel/model.js');
var config = require('../configs/config.js');

class ${model_name} extends model {

}

let obj = new ${model_name} ({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.db,
    table: '${modelName}',
});

module.exports = obj;
`;
}

function includeGlobalyModel(modelName, model_name) {
    fs.appendFile('./include.js', `\nglobal.${model_name} = require('./models/${modelName}');`, function (err) {
        if (err) console.log(err);
        console.log(model_name + ' included globaly in include.js');
      });
}

function checkDir(path = './models') {
   return fs.existsSync(path);
}

main(process.argv);