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

            let buf = Buffer.from(makeFileContent(modelName));
            let len = buf.length;

            fs.write(file, buf, 0, len, 0, (err) => {
                if(err) {
                    console.log('Can\'t write content to file ./models/' + modelName + '.js');
                    return;
                }

                console.log('File ./models/' + modelName + '.js created!');
            });
        });
    });
}

function makeFileContent(modelName) {
    let table = modelName;
    modelName = modelName.charAt(0).toUpperCase() + modelName.slice(1);

    return `
//This file was automaticaly generated
//Feel free to edit :)

var model = require('../kernel/model.js');
var config = require('../configs/config.js');

class `+modelName+` extends model {

}

let obj = new `+modelName+`({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.db,
    table: '`+table+`',
});

module.exports = obj;
`;
}

function checkDir(path = './models') {
   return fs.existsSync(path);
}

console.log(main(process.argv));