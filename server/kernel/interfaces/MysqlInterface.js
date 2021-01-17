const mysql = require('sync-mysql');

class MysqlInterface extends ModelInterface {
    constructor(config) {
        super();
        if(!Array.isArray(config.data)) {
            if(config.table === undefined || config.connection === undefined) {
                return undefined;
            }

            this.table = config.table;
            this.connection = config.connection;
        }
    }

    execute(sql) {
        if(typeof sql !== 'string') {
            return [];
        }

        try {
            return this.connection.query(sql);
        } catch(err) {
            console.error(err);
            return [];
        }
    }

    async executeAsync(sql) {
        if(typeof sql !== 'string') {
            return;
        }

        try {
            this.connection.query(sql);
        } catch(err) {
            console.error(err);
        }
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

    get(index) {
        return this.execute(`
            SELECT * FROM \`${this.table}\`
            WHERE \`id\` = ${index}
            LIMIT 1;
        `)[0];
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

    all() {
        return this.execute(`
            SELECT * FROM \`${this.table}\`
        `);
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

module.exports = MysqlInterface;
