var mysql = require('sync-mysql');

class model {
    constructor(config) {
        if(config.table === undefined || config.host === undefined || config.user === undefined || config.password === undefined || config.database === undefined) {
            return false;
        }

        this.db = config.database;
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
            this.data = this.getDefaultModel();
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
        try {
            return this.connection.query(sql);
        } catch(err) {
            console.log(err);
            return [];
        }
    }

    //Default sql => select * from TableName
    getDefaultModel() {
        return this.normalize(
            this.execute("SELECT * FROM `"+this.table+"`")
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
    save() {
        this.todo.forEach(sql => {
            this.execute(sql);
        })

        this.todo = [];
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
}

module.exports = model;
