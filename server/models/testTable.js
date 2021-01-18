
//This file was automaticaly generated
//Feel free to edit :)

var Model = require('../kernel/model/Model');

//Include interfaces manualy
const MysqlInterface = require('../kernel/interfaces/MysqlInterface');
//Mysql interface configuration 
const mysqlInterface = new MysqlInterface({
    connection: mysqlConnection,
    table: 'testTable'
});

class testTable extends Model {

}

let obj = new testTable (mysqlInterface);
module.exports = obj;
