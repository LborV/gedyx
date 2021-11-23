const fs = require("fs");

function main(arg) {
    if(arg.length <= 2) {
        return 'To few arguments';
    }

    if(!checkDir()) {
        return './actions directory can\'t be found';
    }

    arg.splice(0, 2);

    arg.forEach(actionName => {
        fs.open('./actions/' + actionName + '.js', 'wx+', (err, file) => {
            if(err) {
                console.log('Something wrong with ./actions/' + actionName + '.js file, check it out');
                return;
            }

            let action_name = actionName.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g).map(x => x.toLowerCase()).join('_');

            let buf = Buffer.from(makeFileContent(actionName, action_name));
            let len = buf.length;

            fs.write(file, buf, 0, len, 0, (err) => {
                if(err) {
                    console.log('Can\'t write content to file ./actions/' + actionName + '.js');
                    return;
                }

                console.log('File ./actions/' + actionName + '.js created!');
            });
        });
    });
}

function makeFileContent(actionName, action_name) {
    return `
//This file was automatically generated
//Feel free to edit :)

var Action = require('../kernel/Action');

class ${actionName} extends Action {
    async request(data) {
        this.response(data);
    }
}

let obj = new ${actionName}('${actionName}');
module.exports = obj;
`;
}

function checkDir(path = './actions') {
   return fs.existsSync(path);
}

main(process.argv);