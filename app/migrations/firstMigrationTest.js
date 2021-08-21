
//This file was automaticaly generated
//Feel free to edit :)

const MysqlMigration = require('../kernel/migrations/MysqlMigration');    
class firstMigrationTest extends MysqlMigration {
    async migrate() {
        return await this.executeRaw("SELECT 1 AS test;");
    }
}

module.exports = firstMigrationTest;
