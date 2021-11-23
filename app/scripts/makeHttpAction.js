const fs = require("fs");
const config = require('../configs/config');

function main(arg) {
    if(arg.length <= 2) {
        return 'To few arguments';
    }

    if(!checkDir()) {
        return './httpActions directory can\'t be found';
    }

    arg.splice(0, 2);

    let http = 'api';
    if(config.http) {
        http = Object.keys(config.http)[0];
    }

    arg.forEach(actionName => {
        fs.open('./httpActions/' + actionName + '.js', 'wx+', (err, file) => {
            if(err) {
                console.log('Something wrong with ./httpActions/' + actionName + '.js file, check it out');
                return;
            }

            let buf = Buffer.from(makeFileContent(actionName, http));
            let len = buf.length;

            fs.write(file, buf, 0, len, 0, (err) => {
                if(err) {
                    console.log('Can\'t write content to file ./httpActions/' + actionName + '.js');
                    return;
                }

                console.log('File ./httpActions/' + actionName + '.js created!');
            });
        });
    });
}

function makeFileContent(actionName, http) {
    return `
//This file was automaticaly generated
//Feel free to edit :)

var HttpAction = require('../kernel/HttpAction');

class ${actionName} extends HttpAction {
    async request(data) {
        return data;
    }
}

let obj = new ${actionName}(
    '/${actionName}',
    ${http}
);
module.exports = obj;
`;
}

function checkDir(path = './httpActions') {
   return fs.existsSync(path);
}

main(process.argv);