var model = require('./model.js');

class migration extends model {
    migrate(options) {
        this.query = [];
        this.migrations_exist = false;
        options.forEach(option => {
            if(!(this.getAllTables().includes(option.table)) && (option.drop == undefined || option.drop == false) && !this.migrations_exist) {
                this.createTable(option.table);
            }

            this.migrations_exist = true;

            if(option.drop) {
                this.query.push(this.dropTable(option.table));
            } else {
                this.query.push(this.parseQuery(option));
            }
        });

        return this.execMigration();
    }

    dropTable(tableName) {
        return `DROP TABLE \`${this.database}\`.${tableName};`;
    }

    execMigration() {
        return this.alter(this.query);
    }

    createTable(tableName) {
        this.query.push(`CREATE TABLE \`${this.database}\`.${tableName}(id INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(id));`);
        return this;
    }

    parseQuery(q) {
        if(q.action == undefined) {
            q.action = 'ADD COLUMN';
        }

        if(q.name === undefined || q.type === undefined) {
            return false;
        }

        return `ALTER TABLE \`${this.database}\`.\`${q.table}\` ${q.action} \`${q.name}\` ${q.type};`;
    }

    alter(options) {
        options.forEach(option => {
            if(!option) {
                return;
            }

            try {
                this.execute(option);
            } catch (err) {
                console.log(err);
                return err;
            }
        });
    }
}

module.exports = migration;