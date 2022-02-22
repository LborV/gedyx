const MysqlQueryBuilder = require("../queryBuilder/MysqlQueryBuilder");

class MysqlMigration extends MysqlQueryBuilder {
   /**
    * Create a table called `migrations` in the database
    */
    async createMigrationsTable() {
        await this.executeRaw("CREATE TABLE `migrations` (`name` TEXT, `c_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP());");
        console.info('Migrations table created!');
    }

    /**
     * Check if the migrations table exists.
     * @returns The result of the query.
     */
    async migrationTableExists() {
        let result = await this.executeRaw('SHOW TABLES LIKE "migrations";');
        return result.length > 0;
    }

    /**
     * Check if a migration with the given name exists.
     * @param name - The name of the migration.
     * @returns The result of the query.
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
     * Insert a migration into the database
     * @param name - The name of the migration.
     * @returns The result of the insert query.
     */
    async insertMigration(name) {
        return await this.insert({
            name: name
        }).execute();
    }

    /**
     * It checks if the migration exists in the database, if it does not, it runs the migration and then
     * inserts the migration into the database.
     * @param name - The name of the migration.
     * @returns The migration result.
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
            if(migrationResult) {
                console.info('Migration return: ', migrationResult);``
            }
            
            console.info('\x1b[32m%s\x1b[0m', `${name} migration successfuly migrated!`);
        }
    }

    /* This is a placeholder for the customer to overwrite. */
    async migrate() {}
}

module.exports = MysqlMigration;