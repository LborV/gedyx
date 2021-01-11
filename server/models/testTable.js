
//This file was automaticaly generated
//Feel free to edit :)

var model = require('../kernel/model.js');
var config = require('../configs/config.js');

class test_table extends model {

}

let obj = new test_table ({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.db,
    table: 'testTable',
});

module.exports = obj;
