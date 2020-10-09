var mysql = require('sync-mysql');

class model {
    constructor(config, migration = false) {
        if(migration) {
            config.table = '';
        }

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

        this.cacheWhereEnable = false;

        if(config.cacheWhereEnable !== false) {
            this.cacheWhereEnable = true;
            this.cacheWhere = [];
        } 

         //Operators
        this.operators = {
            '>': function(key, value, data) {
                let result = [];
                data.forEach(el => {
                    if(key in el && el[key] > value) {
                        if(el.id && el.id !== null && el.id !== undefined) {
                            result[el.id] = el;
                        } else {
                            result.push(el);
                        }
                    }
                });

                return result;
            },
            '>=': function(key, value, data) {
                let result = [];
                data.forEach(el => {
                    if(key in el && el[key] >= value) {
                        if(el.id && el.id !== null && el.id !== undefined) {
                            result[el.id] = el;
                        } else {
                            result.push(el);
                        }
                    }
                });

                return result;
            },
            '<': function(key, value, data) {
                let result = [];
                data.forEach(el => {
                    if(key in el && el[key] < value) {
                        if(el.id && el.id !== null && el.id !== undefined) {
                            result[el.id] = el;
                        } else {
                            result.push(el);
                        }
                    }
                });

                return result;
            },
            '<=': function(key, value, data) {
                let result = [];
                data.forEach(el => {
                    if(key in el && el[key] <= value) {
                        if(el.id && el.id !== null && el.id !== undefined) {
                            result[el.id] = el;
                        } else {
                            result.push(el);
                        }
                    }
                });

                return result;
            },
            '!=': function(key, value, data) {
                let result = [];
                data.forEach(el => {
                    if(key in el && el[key] != value) {
                        if(el.id && el.id !== null && el.id !== undefined) {
                            result[el.id] = el;
                        } else {
                            result.push(el);
                        }
                    }
                });

                return result;
            },
            'like': function(key, value, data) {
                let result = [];
                data.forEach(el => {
                    if(key in el && String(el[key]).includes(String(value))) {
                        if(el.id && el.id !== null && el.id !== undefined) {
                            result[el.id] = el;
                        } else {
                            result.push(el);
                        }
                    }
                });

                return result;
            },
            'whereIn': function(key, value, data) {
                let result = [];
                data.forEach(el => {
                    if(key in el && value.includes(el[key])) {
                        if(el.id && el.id !== null && el.id !== undefined) {
                            result[el.id] = el;
                        } else {
                            result.push(el);
                        }
                    }
                });

                return result;
            }
        };

        if(Array.isArray(config.data)) {
            this.data = this.normalize(config.data);
            this.todo = [];

            return this;
        }

        if(!migration) {
            if(config.sql === undefined) {
                this.data = this.getDefaultModel(config.where);
            } else {
                this.sql = config.sql;
                this.data = this.execute(config.sql);
            }
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

    //Refresh
    refresh(ignoreToDo = true, where = '') {
        if(this.cacheWhereEnable) {
            this.cacheWhere = [];
        } 

        if(!ignoreToDo) {
            this.save();
        }

        if(this.sql !== undefined && this.sql) {
            this.data = this.execute(this.sql);
        } else {
            this.data = this.getDefaultModel(where);
        }

        return this;
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
        if(this.cacheWhereEnable) {
            this.cacheWhere = [];
        } 

        if(typeof where !== 'string') {
            where = '';
        } 

        if(where) {
            where = 'WHERE ' + where;
        }

        return this.normalize(
            this.execute(`SELECT * FROM \`${this.table}\` ${where}`)
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
            } else {
                data.push(row);
            }
        });

        return data.filter(function (el) {
            return el != null;
        });
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
        if(this.cacheWhereEnable) {
            this.cacheWhere = [];
        } 

        this.data[index][field] = value;

        if(typeof value === 'string') {
            value = "'"+value+"'";
        }

        this.todo.push(`
            UPDATE ${this.table}
            SET \`${field}\` = ${value}
            WHERE id = ${index};
        `)

        return this;
    }

    update(index, options) {
        if(this.cacheWhereEnable) {
            this.cacheWhere = [];
        } 

        for(const[key, value] of Object.entries(options)) {
            this.set(index, key, value);
        }

        return this;
    }

    //Delete row
    delete(index) {
        if(this.cacheWhereEnable) {
            this.cacheWhere = [];
        } 

        if(!index) {
            return false;
        } 

        this.data.splice(index, 1);
        this.data = this.normalize(this.data);

        this.todo.push(`
            DELETE FROM ${this.table}
            WHERE id = ${index};
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
        if(this.table == undefined) {
            return this.data[this.data.length - 1]['id'] ? this.data[this.data.length - 1]['id'] : null;
        }

        return this.execute(`
            SELECT AUTO_INCREMENT
            FROM information_schema.TABLES
            WHERE TABLE_SCHEMA = "${this.database}"
            AND TABLE_NAME = "${this.table}"
        `)[0].AUTO_INCREMENT;
    }

    //insert
    /**
     * 
     */
    insert(data) {
        if(this.cacheWhereEnable) {
            this.cacheWhere = [];
        } 

        if(this.next === undefined) {
            this.next = this.nextId();
        } else {
            this.next++;
        }

        this.data[this.next] = data;

        Object.keys(data).map(function(key, index) {
            if(typeof data[key] === 'string') {
                data[key] = `'${data[key]}'`;
            }
        });
            

        this.todo.push(`
            INSERT INTO \`${this.table}\`
            (${Object.keys(data)})
            VALUES(${Object.values(data)});
        `);

        return this;
    }

    //Return list of all tables in db
    getAllTables() {
        return this.execute('SHOW TABLES;').map(item => item[Object.keys(item)[0]]);
    }

    //Describe table
    describe() {
        return this.execute(`describe ${this.table};`);
    }

    //get all records
    all() {
        return this.getData();
    }

    //Find function
    find(key, value, operator = false, data) {
        if(operator === false) {
            let result = [];
            data.forEach(el => {
                if(key in el && el[key] == value) {
                    if(el.id && el.id !== null && el.id !== undefined) {
                        result[el.id] = el;
                    } else {
                        result.push(el);
                    }
                }
            });

            return result;
        }

        if(typeof operator !== 'string' && !(operator instanceof String)) {
            return [];
        }

        if(operator == '=') {
            return this.find(key, value, false, data);
        }

        if(!(operator in this.operators)) {
            return [];
        }

       return this.operators[operator](key, value, data);
    }

    setCacheWhere(cacheWhere) {
        this.cacheWhere = cacheWhere;
        return this;
    }

    getCacheWhere() {
        return this.cacheWhere;
    }

    //Where {May be slow}
    /***
     * @param options array of array
     */
    where(options) {
        let data = this.data;
        let optionStringNatation = '';

        if(this.cacheWhereEnable) {
            optionStringNatation = options.toString();

            if(optionStringNatation in this.cacheWhere) {
                return this.cacheWhere[optionStringNatation];
            }
        }

        options.forEach(option => {
            if(data.length == 0) {
                return;
            }

            let operator = '=';
            if(option.length > 2) {
                option[1] = option[1].replace(/\s/g, '');
                operator = option[1];
            }

            data = this.find(option[0], option[2] ? option[2] : option[1], operator, data);            
        });

        let result = [];
        if(data.length > 0) {
            data.forEach(e => {
                if(e != null && e && e !== undefined) {
                    result.push(e);
                }
            });
        }

        if(this.cacheWhereEnable) {
            this.cacheWhere[optionStringNatation] = result;
        }
            
        return result;
    }
}

module.exports = model;
