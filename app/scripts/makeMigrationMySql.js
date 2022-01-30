const fs = require("fs");

function main(arg) {
    if(arg.length <= 2) {
        arg[3] = Date.now();
    }

    try {
        if(!checkDir()) {
            return './migrations directory can\'t be found';
        }
    
        arg.splice(0, 2);
    
        arg.forEach(modelName => {
            modelName = Date.now() + `_${modelName}`;

            fs.open('./migrations/' + modelName + '.js', 'wx+', (err, file) => {
                if(err) {
                    console.log('Something wrong with ./migrations/' + modelName + '.js file, check it out');
                    return;
                }
    
                // let model_name = modelName.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g).map(x => x.toLowerCase()).join('_');
                let model_name = 'Migration_' + modelName;
                let buf = Buffer.from(makeFileContent(modelName, model_name));
                let len = buf.length;
    
                fs.write(file, buf, 0, len, 0, (err) => {
                    if(err) {
                        console.log('Can\'t write content to file ./migrations/' + modelName + '.js');
                        return;
                    }
    
                    console.log('File ./migrations/' + modelName + '.js created!');
                });
            });
        });
    } catch (e) {
        console.error(e);
    }
    
}

function makeFileContent(modelName, model_name) {
    return `
//This file was automatically generated
//Feel free to edit :)

const MysqlMigration = require('../kernel/migrations/MysqlMigration');    
class ${model_name} extends MysqlMigration {
    async migrate() {
        this.executeRaw("");
    }
}

module.exports = ${model_name};
`;
}

function checkDir(path = './models') {
   return fs.existsSync(path);
}

main(process.argv);