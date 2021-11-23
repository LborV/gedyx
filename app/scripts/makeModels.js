const fs = require("fs");
const config = require('../configs/config');

function main(arg) {
    if(arg.length <= 2) {
        return 'To few arguments';
    }

    try {
        if(!checkDir()) {
            return './models directory can\'t be found';
        }
    
        arg.splice(0, 2);
    
        let connection = 'mysqlConnection';
        if(config.mysql) {
            connection = Object.keys(config.mysql)[0];
        }

        arg.forEach(modelName => {
            fs.open('./models/' + modelName + '.js', 'wx+', (err, file) => {
                if(err) {
                    console.log('Something wrong with ./models/' + modelName + '.js file, check it out');
                    return;
                }

                // let model_name = modelName.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g).map(x => x.toLowerCase()).join('_');
                let model_name = modelName;
                let buf = Buffer.from(makeFileContent(modelName, model_name, connection));
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

function makeFileContent(modelName, model_name, connection) {
    return `
//This file was automatically generated
//Feel free to edit :)

const MysqlQueryBuilder = require('../kernel/queryBuilder/MysqlQueryBuilder');    
class ${model_name} extends MysqlQueryBuilder {

}

let obj = new ${model_name}({
    connection: ${connection},
    table: '${modelName}'
});
module.exports = obj;
`;
}

function checkDir(path = './models') {
   return fs.existsSync(path);
}

main(process.argv);