
//This file was automaticaly generated
//Feel free to edit :)

var Model = require('../kernel/model/Model');

//Include interfaces manualy
const MysqlQueryBuilder = require('../kernel/queryBuilder/MysqlQueryBuilder');
//Mysql interface configuration 
const mysqlQueryBuilder = new MysqlQueryBuilder({
    connection: mysqlConnection,
    table: 'testTable'
});

class testTable extends Model {

}

let obj = new testTable(mysqlQueryBuilder);
module.exports = obj;
