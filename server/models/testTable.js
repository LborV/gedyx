
//This file was automaticaly generated
//Feel free to edit :)

var Model = require('../kernel/model/Model.js');
var config = require('../configs/config.js');

//Include interfaces manualy
const MysqlInterface = require('../kernel/interfaces/MysqlInterface');
//Mysql interface configuration 
const mysqlInterface = new MysqlInterface({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.db,
    table: 'testTable'
});


class test_table extends Model {

}

let obj = new test_table(mysqlInterface);

module.exports = obj;
