var mysql = require('sync-mysql');

class model {
    constructor(config) {
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


        if(config.sql === undefined) {
            this.data = this.getDefaultModel(config.where);
        } else {
            this.data = this.execute(config.sql);
        }

        this.todo = [];

        return this;
    }
    
    //Execute custom sql
    /**
     * 
     * @param {string} sql 
     */
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

    //Execute async way, created for save method
    /**
     * 
     * @param {string} sql 
     */
    async executeAsync(sql) {
        if(typeof sql !== 'string') {
            return;
        }

        this.connection.query(sql);
    }

    //Default sql => select * from TableName
    getDefaultModel(where = '') {
        if(typeof where !== 'string') {
            where = '';
        }

        return this.normalize(
            this.execute("SELECT * FROM `"+this.table+"` " +where)
        );
    }

    //Normalize raw data
    /**
     * @param raw
     */
    normalize(raw) {
        if(raw === false || raw === undefined || raw === null) {
            return [];
        }

        let data = [];
        raw.forEach(row => {
            if(row && row.id != undefined) {
                data[row.id] = row;
            }
        });

        return data;
    }

    //Save all changes into db
    async save() {
        this.todo.forEach(sql => {
            this.executeAsync(sql);
        })

        this.todo = [];
        this.next = undefined;
        return this;
    }

    set(index, field, value) {
        this.data[index][field] = value;

        if(typeof value === 'string') {
            value = "'"+value+"'";
        }

        this.todo.push(`
            UPDATE `+this.table+`
            SET \``+field+`\` = `+value+`
            WHERE id = `+index+`;
        `)

        return this;
    }

    //Delete row
    delete(index) {
        if(!index) {
            return false;
        } 

        this.data.splice(index, 1);
        this.data = this.normalize(this.data);

        this.todo.push(`
            DELETE FROM `+this.table+`
            WHERE id = `+index+`;
        `)

        return this;
    }

    //Get all data or one row
    getData(index = false) {
        if(index) {
            if(index in this.data) {
                return this.data[index];
            }

            return false;
        }

        return this.data;
    }

    //Get like getData only one row
    get(index = false) {
        if(index in this.data) {
            return this.getData(index);
        }

        return false;
    }

    //return next id
    nextId() {
        return this.execute(`
            SELECT AUTO_INCREMENT
            FROM information_schema.TABLES
            WHERE TABLE_SCHEMA = "`+this.database+`"
            AND TABLE_NAME = "`+this.table+`"
        `)[0].AUTO_INCREMENT;
    }

    //insert
    /**
     * 
     */
    insert(data) {
        if(this.next === undefined) {
            this.next = this.nextId();
        } else {
            this.next++;
        }

        this.data[this.next] = data;

        Object.keys(data).map(function(key, index) {
            if(typeof data[key] === 'string') {
                data[key] = '\'' + data[key] + '\'';
            }
        });
            

        this.todo.push(`
            INSERT INTO \``+this.table+`\`
            (`+Object.keys(data)+`)
            VALUES(`+Object.values(data)+`);
        `);
    }

    //Describe table
    describe() {
        return this.execute('describe ' + this.table + ';');
    }
}

module.exports = model;
