const fs = require("fs");

function main(arg) {
    if(arg.length <= 2) {
        return 'To few arguments';
    }

    try {
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
    
                // let model_name = modelName.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g).map(x => x.toLowerCase()).join('_');
                let model_name = modelName;
                let buf = Buffer.from(makeFileContent(modelName, model_name));
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
    } catch (e) {
        console.error(e);
    }
    
}

function makeFileContent(modelName, model_name) {
    return `
//This file was automaticaly generated
//Feel free to edit :)

var Model = require('../kernel/model/Model');

//Include interfaces manualy
const MysqlInterface = require('../kernel/interfaces/MysqlInterface');
//Mysql interface configuration 
const mysqlInterface = new MysqlInterface({
    connection: mysqlConnection,
    table: '${modelName}'
});

class ${model_name} extends Model {

}

let obj = new ${model_name} (mysqlInterface);
module.exports = obj;
`;
}

function checkDir(path = './models') {
   return fs.existsSync(path);
}

main(process.argv);