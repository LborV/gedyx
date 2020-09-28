const fs = require("fs");

function main(arg) {
    arg.splice(0, 2);

    if(!checkDir()) {
        return './migrations directory can\'t be found';
    }

    let filename = new Date().valueOf();
    if(arg[0]) {
        filename = arg[0];
    }

    fs.open('./migrations/' + filename + '.js', 'wx+', (err, file) => {
        if(err) {
            console.log('Something wrong with ./migrations/' + filename + '.js file, check it out');
            return;
        }

        fs.writeFileSync(`./migrations/${filename}.js`, makeFileContent());
    });
}

function checkDir(path = './migrations') {
    return fs.existsSync(path);
 }

main(process.argv);

function makeFileContent() {
    return `
//This file was automaticaly generated
//Feel free to edit :)
var config = require('../configs/config.js');
var migration = require('../kernel/migration.js');

var _migration = new migration({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.db,
}, true);

_migration.migrate([
    {table: '', drop: false, name: '', type: ''}
]);
`;
}