const QueryBuilder = require('./QueryBuilder');
class MysqlQueryBuilder extends QueryBuilder {
    constructor(config) {
        super();
        this.connection = config.connection;
        this.sql = '';

        if(config.table) {
            this.tableName = config.table;
            this.table(config.table);
        }
    }

    setConnection(connection) {
        return this.connection = connection;
    } 
    
    async getConnection() {
        return await this.connection.getConnection();
    }

    async startTransaction() {
        let connection = await this.getConnection();
        await this.executeRaw('START TRANSACTION;', connection);
        return connection;
    }

    async commit(connection = null) {
        let res = await this.executeRaw('COMMIT;', connection);
        
        if(connection !== null && typeof connection.release === 'function') {
            await connection.release();
        } else {
            if(typeof this.connection.release === 'function') {
                await this.connection.release();
            }
        }

        return res;
    }

    async rollback(connection = null) {
        let res = await this.executeRaw('ROLLBACK;', connection);
        
        if(connection !== null && typeof connection.release === 'function') {
            await connection.release();
        } else {
            if(typeof this.connection.release === 'function') {
                await this.connection.release();
            }
        }

        return res;
    }

    async execute(connection = null) {
        let res = [];

        if(connection != null) {
            res = await connection.query(this.getSql());
        } else {
            res = await this.connection.query(this.getSql());
        }

        this.resetQuery();

        if(this.tableName) {
            this.table(this.tableName); 
        }

        return Object.values(JSON.parse(JSON.stringify(res[0])));
    }

    async executeRaw(sql, connection = null) {
        if(typeof sql !== 'string') {
            throw 'Incorrect input';
        }

        this.resetQuery();
        if(this.tableName) {
            this.table(this.tableName); 
        }

        let res = [];
        
        if(connection != null) {
            res = await connection.query(sql);
        } else {
            res = await this.connection.query(sql);
        }

        return Object.values(JSON.parse(JSON.stringify(res[0])));
    }

    escape(value) {
        return SqlString.escape(value);
    }

    makeSelectQuery(subWhere) {
        let obj = this.queryObject;
        if(subWhere) {
            obj = subWhere;
        }

        let sql = '';

        let clearSelect = [];
        obj.select.forEach((value, index) => {
            if(value) {
                clearSelect.push(value);
            }
        });

        if(obj.select.length) {
            sql += 'SELECT ';
            let delimiter = ',';
            obj.select.forEach((element, index) => {
                if(index === obj.select.length - 1) {
                    delimiter = '';
                }
    
                if(typeof element === 'string') {
                    if((element.match(/\./g) || []).length === 1) {
                        element = SqlString.escapeId(element);
                    }

                    sql += `${element}${delimiter} `;
                } else if(typeof element === 'object' && element.raw) {
                    sql += `${element.value}${delimiter} `;
                }
            });
        } else {
            sql += `SELECT \`${obj.table}\`.* `;
            obj.select = [''];
        }
   
        if(obj.table.length) {
            sql += `FROM \`${obj.table}\` `;
        }

        if(obj.join.length) {
            this.isJoin = true;
            obj.join.forEach(j => {
                sql += j.operator + ` \`${j.table}\` `;
                sql += this.makeWhere(j.value);
            });
            this.isJoin = false;
        }

        sql += this.makeWhere(obj);

        if(this.queryObject.forUpdate) {
            sql += 'FOR UPDATE ';
        }

        if(this.queryObject.forShare) {
            sql += 'FOR SHARE ';
        }

        if(obj.union) {
            sql += 'UNION ';
            if(obj.union.all) {
                sql += 'ALL ';
            } 
            sql += this.makeSelectQuery(obj.union.value);
        }

        if(obj.order.length) {
            sql += 'ORDER BY ';
            let delimiter = ',';
            obj.order.forEach((order, index) => {
                if(index === obj.order.length - 1) {
                    delimiter = '';
                }

                sql += `\`${order.value}\` ${order.type}${delimiter} `
            });
        }

        if(obj.group) {
            sql += `GROUP BY \`${obj.group}\``; 
        }

        if(obj.limit) {
            if(typeof obj.limit.offset === 'number') {
                sql += `LIMIT ${obj.limit.limit} OFFSET ${obj.limit.offset} `;
            } else {
                sql += `LIMIT ${obj.limit.limit} `;
            }
        } 

        if(subWhere) {
            return sql;
        }

        return this.sql = sql + ';';
    }

    makeWhere(obj) {
        let sql = '';
        if(obj.where.length) {
            obj.where.forEach((where, index) => {
                if(index == 0 && (obj.select.length || obj.update.length || obj.delete || this.isJoin)) {
                    if(!this.isJoin) {
                        sql += 'WHERE ';
                    } else {
                        sql += 'ON ';
                    }
                }

                if(where.subWhere) {
                    let isJoinSave = this.isJoin;
                    this.isJoin = false;

                    if(where.a1) {
                        where.a1 = SqlString.escapeId(where.a1);
                        sql += `${where.a1} ${where.operator} `;
                    }

                    sql += '(';
                    sql += this.makeSelectQuery(where.subWhere);
                    sql += ') ';

                    this.isJoin = isJoinSave;
                } else {
                    where.a1 = SqlString.escapeId(where.a1);

                    if(typeof where.a2 === 'string' && (where.a2.match(/\./g) || []).length === 1) {
                        where.a2 = SqlString.escapeId(where.a2);
                    } else if(where.operator !== 'IN') {
                        where.a2 = this.escape(where.a2);
                    }

                    sql += `${where.a1} ${where.operator} ${where.a2} `;
                }

                let delimiter = 'AND ';
                if(index == obj.where.length - 1) {
                    delimiter = '';
                } else if(where.delimiter) {
                    delimiter = where.delimiter;
                }

                if(obj.where[index+1]) {
                    if(obj.where[index+1].isOr) {
                        delimiter = 'OR ';
                    }
                }

                sql += delimiter;
            });
        }

        return sql;
    }

    makeUpdateQuery() {
        let sql = `UPDATE \`${this.queryObject.table}\` SET `;
        let delimiter = ',';

        this.queryObject.update.forEach((item, index) => {
            if(index === this.queryObject.update.length - 1) {
                delimiter = '';
            }

            item[1] = this.escape(item[1]);
            sql += `\`${item[0]}\` = ${item[1]}${delimiter} `;
        });

        sql += this.makeWhere(this.queryObject);

        return this.sql = sql + ';';
    }

    makeInsertQuery() {
        let sql = `INSERT INTO \`${this.queryObject.table}\`( `;
        let delimiter = ',';

        this.queryObject.insert.forEach((item, index) => {
            if(index === this.queryObject.insert.length - 1) {
                delimiter = '';
            }
            
            sql += `\`${item[0]}\`${delimiter} `;
        });

        sql += ') VALUES (';

        delimiter = ',';
        this.queryObject.insert.forEach((item, index) => {
            if(index === this.queryObject.insert.length - 1) {
                delimiter = '';
            }

            item[1] = this.escape(item[1]);
            sql += `${item[1]}${delimiter} `;
        });

        return this.sql = sql + ');';
    }

    makeDeleteQuery() {
        let sql = `DELETE FROM \`${this.queryObject.table}\` `;
        sql += this.makeWhere(this.queryObject);
        return this.sql = sql + ';';
    }

    queryToSql() {
        if(!this.queryObject.table) {
            throw 'No table';
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

        return this.makeSelectQuery();
    }

    getSql() {
        this.queryToSql();
        
        this.resetQuery();
        if(this.tableName) {
            this.table(this.tableName); 
        }

        return this.sql;
    }

    truncate() {
        return this.executeRaw(`TRUNCATE \`${this.tableName}\``);
    }
}

module.exports = MysqlQueryBuilder;