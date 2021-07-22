
//This file was automaticaly generated
//Feel free to edit :)

const MysqlQueryBuilder = require('../kernel/queryBuilder/MysqlQueryBuilder');    
class todos extends MysqlQueryBuilder {
    getAll() {
        return this
            .selectRaw('*')
            .orderByDesc('id')
            .execute();
    }
}

let obj = new todos({
    connection: mysqlConnection,
    table: 'todos'
});
module.exports = obj;
