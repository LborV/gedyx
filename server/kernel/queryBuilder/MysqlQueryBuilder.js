class MysqlQueryBuilder extends QueryBuilder {
    constructor(config) {
        super();
        this.connection = config.connection;
        this.sql = '';

        if(config.table) {
            this.table(config.table);
        }
    }

    get() {
        return this.connection.query(this.getSql());
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

                sql += `\`${order.value}\` ${order.type}${delimeter} `
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
                if(index == 0 && (obj.select.length || obj.update.length || obj.delete)) {
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
            sql += `\`${item[0]}\` = ${item[1]}${delimeter} `;
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
            sql += `\`${item[0]}\`${delimeter} `;
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

    makeDeleteQuery() {
        let sql = `DELET FROM \`${this.queryObject.table}\` `;
        sql += this.makeWhere(this.queryObject);
        return this.sql = sql + ';';
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

        if(this.queryObject.delete) {
            return this.makeDeleteQuery();
        }

        throw 'Wrong Operation';
    }

    getSql() {
        this.queryToSql();
        return this.sql;
    }

    selectRaw(str) {
        if(typeof str !== 'string') {
            throw 'Incorrect input';
        }

        this.queryObject.select.push(str);

        return this;
    }

    getQueryObject() {
        return this.queryObject;
    }

    whereLike(a1, a2) {
        if(typeof a1 !== 'string' || typeof a2 !== 'string') {
            throw 'Incorrect input';
        }

        return this.where(a1, 'LIKE', `'${a2}'`);
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
}

module.exports = MysqlQueryBuilder;