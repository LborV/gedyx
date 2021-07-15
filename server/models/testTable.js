//This file was automaticaly generated
//Feel free to edit :)

const MysqlQueryBuilder = require('../kernel/queryBuilder/MysqlQueryBuilder');    
class testTable extends MysqlQueryBuilder {
    getAll() {
        return this
            .selectRaw('*')
            .get();
    }
}

let obj = new testTable({
    connection: mysqlConnection,
    table: 'testTable'
});
module.exports = obj;
