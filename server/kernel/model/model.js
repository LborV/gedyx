var mysql = require('sync-mysql');

class model {
    constructor(config) {
        if(!Array.isArray(config.data)) {
            if(config.table === undefined || config.host === undefined || config.user === undefined || config.password === undefined || config.database === undefined) {
                return false;
            }

            this.database = config.database;
            this.table = config.table;

            try {
                this.connection = new mysql({
                    host: config.host,
                    user: config.user,
                    password: config.password,
                    database: config.database
                });
            } catch(err) {
                console.log(err);
                return false;
            }
        }
    }

    execute(sql) {
        if(typeof sql !== 'string') {
            return [];
        }

        try {
            return this.connection.query(sql);
        } catch(err) {
            console.log(err);
            return [];
        }
    }

    async executeAsync(sql) {
        if(typeof sql !== 'string') {
            return;
        }

        this.connection.query(sql);
    }

    set(index, field, value) {
        if(typeof value === 'string') {
            value = "'"+value+"'";
        }

        this.execute(`
            UPDATE \`${this.table}\`
            SET \`${field}\` = ${value}
            WHERE id = ${index};
        `);

        return this;
    }

    update(index, options) {
        for(const[key, value] of Object.entries(options)) {
            this.set(index, key, value);
        }

        return this;
    }

    delete(index) {
        this.execute(`
            DELETE FROM \`${this.table}\`
            WHERE \`id\` = ${index};
        `)

        return this;
    }

    //Get all data or one row
    getData(index = false) {
        if(index === false) {
            return this.execute(`
            SELECT * FROM \`${this.table}\`
        `);
        }

        return this.execute(`
            SELECT * FROM \`${this.table}\`
            WHERE \`id\` = ${index}
            LIMIT 1;
        `)[0];
    }

    get(index = false) {
        return this.getData(index);
    }

    insert(data) {
        Object.keys(data).map(function(key, index) {
            if(typeof data[key] === 'string') {
                data[key] = `'${data[key]}'`;
            }
        });
            

        return this.execute(`
            INSERT INTO \`${this.table}\`
            (${Object.keys(data)})
            VALUES(${Object.values(data)});
        `);
    }

    getAllTables() {
        return this.execute('SHOW TABLES;').map(item => item[Object.keys(item)[0]]);
    }

    describe() {
        return this.execute(`describe ${this.table};`);
    }

    all() {
        return this.getData();
    }

    where(options) {
        let where = '';
        let isFirst = true;
        options.forEach(option => {
            let operator = '=';
            if(option.length > 2) {
                option[1] = option[1].replace(/\s/g, '');
                operator = option[1];
            }

            if(isFirst) {
                where += ' WHERE ';
                isFirst = false;
            } else {
                where += ' AND ';
            }

            let value = option[2] ? option[2] : option[1];
            where += ` \`${option[0]}\` ${operator} ${value}`;
        });

        if(where != '') {
            return this.execute(`
                SELECT * FROM \`${this.table}\` 
                ${where}
            `);
        } else {
            return [];
        }
    }
}

module.exports = model;