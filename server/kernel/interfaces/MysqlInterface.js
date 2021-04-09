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

        try {
            this.execute(`
                UPDATE \`${this.table}\`
                SET \`${field}\` = ${value}
                WHERE id = ${index};
            `);

            return this;
        } catch(e) {
            throw e;
        }
    }

    update(index, options) {        
        for(const[key, value] of Object.entries(options)) {
            if(Array.isArray(index)) {
                index.forEach(i => this.set(i, key, value));
            } else {
                this.set(index, key, value);
            }
        }

        return this;
    }

    delete(index) {
        try {
            this.execute(`
                DELETE FROM \`${this.table}\`
                WHERE \`id\` = ${index};
            `);

            return this;
        } catch(e) {
            throw e;
        }

    }

    get(index) {
        try {
            const res = this.execute(`
                SELECT * FROM \`${this.table}\`
                WHERE \`id\` = ${index}
                LIMIT 1;
            `);

            return res[0] ?? [];
        } catch(e) {
            throw e;
        }
    }

    insert(data) {
        Object.keys(data).map(function(key, index) {
            if(typeof data[key] === 'string') {
                data[key] = `'${data[key]}'`;
            }
        });

        try {
            const res = this.execute(`
                INSERT INTO \`${this.table}\`
                (${Object.keys(data)})
                VALUES(${Object.values(data)});
            `);

            this.lastId = res?.insertId ?? undefined;
        } catch(e) {
            throw e;
        }

        return this;
    }

    getLastId() {
        return this.lastId;
    }

    all() {
        try {
            const res = this.execute(`
                SELECT * FROM \`${this.table}\`
            `);

            return res ?? [];
        } catch(e) {
            throw e;
        }
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
            if(typeof value === 'string') {
                value = `'${value}'`;
            }

            where += ` \`${option[0]}\` ${operator} ${value}`;
        });

        if(where != '') {
            try {
                const res = this.execute(`
                    SELECT * FROM \`${this.table}\` 
                    ${where}
                `);

                return res ?? [];
            } catch(e) {
                throw e;
            }
        } else {
            return [];
        }
    }

    dropTable(tableName) {
        try {
            this.execute(`DROP TABLE IF EXISTS \`${tableName}\``);
        } catch(e) {
            throw e;
        }
    }

    createTable(tableName, options) {
        try {
            // BIG TODO
        } catch(e) {
            throw e;
        }
    }

    updateTable(tableName, options) {
        try {
            // BIG TODO
        } catch(e) {
            throw e;
        }
    }
}

module.exports = MysqlInterface;
