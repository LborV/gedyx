const MysqlQueryBuilder = require("../queryBuilder/MysqlQueryBuilder");

/**
 * 
 */
class MysqlMigration extends MysqlQueryBuilder {
   /**
    * 
    */
    async createMigrationsTable() {
        await this.executeRaw("CREATE TABLE `migrations` (`name` TEXT, `c_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP());");
        console.info('Migrations table created!');
    }

    /**
     * 
     * @returns {Boolean}
     */
    async migrationTableExists() {
        let result = await this.executeRaw('SHOW TABLES LIKE "migrations";');
        return result.length > 0;
    }

    /**
     * 
     * @param {String} name 
     * @returns {Boolean}
     */
    async migrationExists(name) {
        let table = await this.migrationTableExists();
        if(!table) {
            await this.createMigrationsTable();
            return false;
        }

        let result = await this.where('name', name).execute();
        return result.length > 0;
    }

    /**
     * 
     * @param {String} name 
     * @returns {Object} 
     */
    async insertMigration(name) {
        return await this.insert({
            name: name
        }).execute();
    }

    /**
     * 
     * @param {String} name 
     * @returns {Void}
     */
    async migrationCall(name) {
        this.table('migrations');
        let migration = await this.migrationExists(name);
        if(!migration) {
            let migrationResult = null;
            try {
                this.resetQuery();
                migrationResult = await this.migrate();
                this.resetQuery();
                this.table('migrations');
            } catch(error) {
                console.error(error);
                return;
            }

            await this.insertMigration(name);
            console.info('Migration return: ', migrationResult);``
            console.info('\x1b[32m%s\x1b[0m', `${name} migration successfuly migrated!`);
        }
    }

    /**
     * Should be redefined by customer
     */
    migrate() {}
}

module.exports = MysqlMigration;