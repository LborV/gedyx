
//This file was automaticaly generated
//Feel free to edit :)

const MysqlQueryBuilder = require('../../kernel/queryBuilder/MysqlQueryBuilder');    
class todos extends MysqlQueryBuilder {
    async getAll() {
        return await this
            .orderByDesc('id')
            .execute();
    }
}

let obj = new todos({
    connection: mysqlConnection,
    table: 'todos'
});
module.exports = obj;
