const MysqlQueryBuilder = require("../queryBuilder/MysqlQueryBuilder");

class MysqlMigration extends MysqlQueryBuilder {
    async createMigrationsTable() {
        await this.executeRaw("CREATE TABLE `migrations` (`name` TEXT, `c_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP());");
        console.info('Migrations table created!');
    }

    async migrationTableExists() {
        let result = await this.executeRaw('SHOW TABLES LIKE "migrations";');
        return result.length > 0;
    }

    async migrationExists(name) {
        let table = await this.migrationTableExists();
        if(!table) {
            await this.createMigrationsTable();
            return false;
        }

        let result = await this.where('name', name).execute();
        return result.length > 0;
    }

    async insertMigration(name) {
        return await this.insert({
            name: name
        }).execute();
    }

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

    // Should be reloaded by customer
    async migrate() {}
}

module.exports = MysqlMigration;