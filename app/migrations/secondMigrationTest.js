
//This file was automaticaly generated
//Feel free to edit :)

const MysqlMigration = require('../kernel/migrations/MysqlMigration');    
class secondMigrationTest extends MysqlMigration {
    async migrate() {
        return await this.table('todos').insert({
            text: 'name'
        }).execute();
    }
}

module.exports = secondMigrationTest;
