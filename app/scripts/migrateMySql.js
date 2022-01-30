const Loader = require('../kernel/Loader');
const MysqlMigration = require('../kernel/migrations/MysqlMigration');
const main = require('../main');

class MysqlMigrateOperation extends Loader {
    constructor() {
        super();

        this.migrations = {};
        this.load();
    }

    load(dirName = 'migrations') {
        try{
            let normalizedPath = require("path").join('', dirName);
            this.getFiles(normalizedPath).forEach((file) => {
                if(!file.includes('.js')) {
                    return;
                }

                let model = require(`../${file}`);
                let modelName = file.replace('.js', '');
                this.migrations[modelName] = model;
            });
        } catch(e) {
            console.error(e);
        }
    }

    async migrate(connection) {
        for(let key of Object.keys(this.migrations).sort()) {
            let migration = new this.migrations[key]({connection: connection, table: 'migrations'});

            if(migration instanceof MysqlMigration) {
                try {
                    await migration.migrationCall(key);
                } catch(error) {
                    console.error(error);
                }
            }
        }
    }
}

main().then(() => {
    let mysqlConnection = undefined;
    
    if(config.mysql) {
        mysqlConnection = globalThis[Object.keys(config.mysql)[0]];
    }

    if(mysqlConnection !== undefined) {
        new MysqlMigrateOperation().migrate(mysqlConnection).then(() => {
            console.log('Migrated!');
            process.exit(0);
        });
    } else {
        console.log('Can\'t migrate!');
        process.exit(0);
    }
});