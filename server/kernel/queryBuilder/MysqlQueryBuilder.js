class MysqlQueryBuilder {
    constructor(connection) {
        this.connection = config.connection;
        this.sql = '';
        this.queryObject = {
            select: [],
            table: '',
            where: [],
            join: [],
            order: [],
            update: [],
            limit: null,
            insert: []
        };

        return this;
    }

    makeSelectQuery(subWhere) {
        let obj = this.queryObject;
        if(subWhere) {
            obj = subWhere;
        }

        let sql = '';

        if(obj.select.length) {
            sql += 'SELECT ';
            let delimeter = ',';
            obj.select.forEach((element, index) => {
                if(index === obj.select.length - 1) {
                    delimeter = '';
                }
    
                if(typeof element === 'string') {
                    sql += `${element}${delimeter} `;
                }
            });
        }
   
        if(obj.table.length) {
            sql += `FROM \`${obj.table}\` `;
        }

        sql += this.makeWhere(obj);

        if(obj.limit) {
            sql += `LIMIT ${obj.limit} `;
        } 

        if(obj.order.length) {
            sql += 'ORDER BY ';
            let delimeter = ',';
            obj.order.forEach((order, index) => {
                if(index === obj.order.length - 1) {
                    delimeter = '';
                }

                sql += `${order.value} ${order.type}${delimeter} `
            });
        }

        sql += ';';

        if(subWhere) {
            return sql;
        }

        return this.sql = sql;
    }

    makeWhere(obj) {
        let sql = '';
        if(obj.where.length) {
            obj.where.forEach((where, index) => {
                if(index == 0 && (obj.select.length || obj.update.length)) {
                    sql += 'WHERE ';
                }

                if(where.subWhere) {
                    sql += '(';
                    sql += this.makeSelectQuery(where.subWhere);
                    sql += ') ';
                } else {
                    sql += `\`${where.a1}\` ${where.operator} ${where.a2} `;
                }

                let delimetr = 'AND ';
                if(index == obj.where.length - 1) {
                    delimetr = '';
                } else if(where.delimeter) {
                    delimetr = where.delimeter;
                }

                if(obj.where[index+1]) {
                    if(obj.where[index+1].isOr) {
                        delimetr = 'OR ';
                    }
                }

                sql += delimetr;
            });
        }

        return sql;
    }

    makeUpdateQuery() {
        let sql = `UPDATE \`${this.queryObject.table}\` SET `;
        let delimeter = ',';

        this.queryObject.update.forEach((item, index) => {
            if(index === this.queryObject.update.length - 1) {
                delimeter = '';
            }
            sql += `${item[0]} = ${item[1]}${delimeter} `;
        });

        sql += this.makeWhere(this.queryObject);

        return this.sql = sql + ';';
    }

    makeInsertQuery() {
        let sql = `INSERT INTO \`${this.queryObject.table}\`( `;
        let delimeter = ',';

        this.queryObject.insert.forEach((item, index) => {
            if(index === this.queryObject.insert.length - 1) {
                delimeter = '';
            }
            sql += `${item[0]}${delimeter} `;
        });

        sql += ') VALUES (';
        this.queryObject.insert.forEach((item, index) => {
            if(index === this.queryObject.insert.length - 1) {
                delimeter = '';
            }
            sql += `${item[1]}${delimeter} `;
        });

        return this.sql = sql + ');';
    }

    update(updObject) {
        if(typeof updObject !== 'object' || updObject === null) {
            throw 'Not an object';
        }

        Object.keys(updObject).forEach(key => {
            let value = updObject[key];
            if(typeof value === 'string') {
                value = `'${value}'`;
            }

            this.queryObject.update.push([`\'${key}\``, value]);
        });

        return this;
    }

    insert(inObject) {
        if(typeof inObject !== 'object' || inObject === null) {
            throw 'Not an object';
        }

        Object.keys(inObject).forEach(key => {
            let value = inObject[key];
            if(typeof value === 'string') {
                value = `'${value}'`;
            }

            this.queryObject.insert.push([`\'${key}\``, value]);
        });

        return this;
    }

    queryToSql() {
        if(!this.queryObject.table) {
            throw 'No table';
        }

        if(this.queryObject.select.length) {
            return this.makeSelectQuery();
        }

        if(this.queryObject.update.length) {
            return this.makeUpdateQuery();
        }

        if(this.queryObject.insert.length) {
            return this.makeInsertQuery();
        }

        throw 'Wrong Operation';
    }

    getSql() {
        this.queryToSql();
        return this.sql;
    }

    table(tableName) {
        if(typeof tableName != 'string') {
            throw 'Table Name most be a String';
        }

        this.queryObject.table = tableName;
        return this;
    }

    selectRaw(str) {
        if(typeof str !== 'string') {
            throw 'Incorrect input';
        }

        this.queryObject.select.push(str);

        return this;
    }

    select() {
        for(var i = 0; i < arguments.length; i++) {
            let arg = arguments[i];
            if(Array.isArray(arg)) {
                arg.forEach(item =>{
                    this.select(item);
                });
            } else if (typeof arg === 'string') {
                this.queryObject.select.push(`\`${arg}\``);                
            } else {
                throw 'Inccorect input';
            }
        }

        return this;
    }

    getQueryObject() {
        return this.queryObject;
    }

    where() {
        let isOr = false;
        if(this.nextQueryOr) {
            this.nextQueryOr = false;
            isOr = true;
        }

        if(arguments.length == 1) {
            if(typeof arguments[0] === 'function') {
                this.queryObject.where.push({
                    subWhere: arguments[0](new MysqlQueryBuilder(this.connection)).getQueryObject(),
                    isOr: isOr
                });
           
                return this;
            } 
        }

        if(arguments.length == 2) {
            if(typeof arguments[0] !== 'string') {
                throw 'First parametr must be string';
            }

            this.queryObject.where.push({
                a1: arguments[0],
                a2: arguments[1],
                operator: '=',
                isOr: isOr
            });

            return this;
        }

        if(arguments.length == 3) {
            if(typeof arguments[0] !== 'string' || typeof arguments[1] !== 'string') {
                throw 'Inccorect input';
            }

            if(typeof arguments[2] !== 'string' && typeof arguments[2] !== 'number') {
                throw 'Inccorect input';
            }

            this.queryObject.where.push({
                a1: arguments[0],
                a2: arguments[2],
                operator: arguments[1],
                isOr: isOr
            });

            return this;
        }

        throw 'Inccorect number of arguments';
    }

    orWhere() {
        this.nextQueryOr = true;
        return this.where(...arguments)
    }

    whereIn(a1, a2) {
        if(typeof a1 !== 'string' || !Array.isArray(a2)) {
            throw 'Incorrect input';
        }
        
        return this.where(a1, 'IN', '('+a2.map((item) => {return typeof item === 'string' ? `'${item}'` : item}).join(', ')+')');
    }

    whereNotIn(a1, a2) {
        if(typeof a1 !== 'string' || !Array.isArray(a2)) {
            throw 'Incorrect input';
        }
        
        return this.where(a1, 'NOT IN', '('+a2.map((item) => {
            if(typeof item === 'string') {
                return `'${item}'`;
            }

            if(typeof item === 'number') {
                return item;
            }

            throw 'Inncorrect input';
        }).join(', ')+')');
    }

    whereNull(a1) {
        if(typeof a1 !== 'string') {
            throw 'Incorrect input';
        }

        return this.where(a1, 'IS', 'NULL')
    }

    whereRaw(sql) {
        if(typeof sql !== 'string') {
            throw 'Must be a string';
        }

        this.queryObject.where.push(sql);
        return this;
    }

    whereNotNull(a1) {
        if(typeof a1 !== 'string') {
            throw 'Incorrect input';
        }

        return this.where(a1, 'IS NOT', 'NULL')
    }

    orderBy(a1) {
        if(typeof a1 !== 'string') {
            throw 'Incorrect input';
        }

        this.queryObject.order.push({value: `\`${a1}\``, type: 'ASC'});
        return this;
    }

    orderByDesc(a1) {

        if(typeof a1 !== 'string') {
            throw 'Incorrect input';
        }

        this.queryObject.order.push({value: `\`${a1}\``, type: 'DESC'});
        return this;
    }

    limit(num) {
        if(typeof num !== 'number') {
            throw 'Limit should be a number';
        }

        this.queryObject.limit = num;
        return this;
    }
}

module.exports = MysqlQueryBuilder;