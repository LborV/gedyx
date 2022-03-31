const QueryBuilder = require('./QueryBuilder');
class MysqlQueryBuilder extends QueryBuilder {
    /**
     * The constructor function creates a new instance of the class. 
     * It takes a single argument, which is an object containing the connection and table name. 
     * The constructor function sets the connection and tableName properties on the new instance
     * @param config - The configuration object passed to the constructor.
     */
    constructor(config) {
        super();
        this.connection = config.connection;
        this.sql = '';

        if(config.table) {
            this.tableName = config.table;
            this.table(config.table);
        }
    }

    /**
     * Set the connection property to the connection parameter
     * @param connection - The connection to the database.
     * @returns The connection object.
     */
    setConnection(connection) {
        return this.connection = connection;
    }

    /**
     * Get a connection to the database
     * @returns The connection object.
     */
    async getConnection() {
        return await this.connection.getConnection();
    }

    /**
     * Start a transaction
     * @returns The connection object.
     */
    async startTransaction() {
        let connection = await this.getConnection();
        await this.executeRaw('START TRANSACTION;', connection);
        return connection;
    }

    /**
     * Commit the transaction
     * @param [connection=null] - The connection to use. If not provided, the default connection will be
     * used.
     * @returns The result of the query.
     */
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

    /**
     * Rollback the current transaction
     * @param [connection=null] - The connection to use. If not provided, the default connection will be
     * used.
     * @returns The result of the query.
     */
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

    /**
     * This function will execute the query that is stored in the query property. 
     * If a connection is passed in, it will use that connection. 
     * Otherwise, it will use the connection that is stored in the connection property. 
     * It will then return the result of the query. 
     * If the query is a select query, it will return the result of the query. 
     * If the query is an insert, update, or delete query, it will return the number of rows affected by
     * the query
     * @param [connection=null] - A connection to the database. If you don't provide a connection, the
     * query will use the connection you set in the constructor.
     * @returns An array of objects.
     */
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

    /**
     * This function executes a raw SQL query and returns the result
     * @param sql - The SQL query to be executed.
     * @param [connection=null] - The connection to use. If null, the default connection will be used.
     * @returns The result of the query.
     */
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

    /**
     * Escape a string value for use in a SQL query
     * @param value - The value to escape.
     * @returns The escaped value.
     */
    escape(value) {
        return SqlString.escape(value);
    }

    /**
     * This function creates a SQL query string from the query object
     * @param subWhere - If you want to make a subquery, you can pass in a subquery object.
     * @returns The SQL query string.
     */
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

                sql += `${SqlString.escapeId(order.value)} ${order.type}${delimiter} `;
            });
        }

        if(obj.group.length) {
            sql += 'GROUP BY ';
            let delimiter = ',';
            obj.group.forEach((group, index) => {
                if(index === obj.group.length - 1) {
                    delimiter = '';
                }

                sql += `${SqlString.escapeId(group)}${delimiter} `;
            });
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

    /**
     * It takes an object with the following properties:
     * 
     * where: An array of objects with the following properties:
     * 
     * a1: The column name
     * a2: The value to compare to
     * operator: The comparison operator
     * subWhere: An object with the same properties as the where object
     * delimiter: The delimiter to use between conditions
     * isOr: Whether to use OR instead of AND
     * @param obj - The object that contains the query parameters.
     * @returns The SQL string.
     */
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
                    if(typeof where === 'string') {
                        sql += `${where} `;
                    } else {
                        where.a1 = SqlString.escapeId(where.a1);

                        if(typeof where.a2 === 'string' && (where.a2.match(/\./g) || []).length === 1) {
                            where.a2 = SqlString.escapeId(where.a2);
                        } else if(where.operator !== 'IN') {
                            if(where.a2 !== 'NULL') {
                                where.a2 = this.escape(where.a2);
                            }
                        }

                        sql += `${where.a1} ${where.operator} ${where.a2} `;
                    }
                }

                let delimiter = 'AND ';
                if(index == obj.where.length - 1) {
                    delimiter = '';
                } else if(where.delimiter) {
                    delimiter = where.delimiter;
                }

                if(obj.where[index + 1]) {
                    if(obj.where[index + 1].isOr) {
                        delimiter = 'OR ';
                    }
                }

                sql += delimiter;
            });
        }

        return sql;
    }

    /**
     * This function creates the update query
     * @returns The SQL query string.
     */
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

    /**
     * This function creates the INSERT query for the database
     * @returns The SQL query string.
     */
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

    /**
     * This function creates a delete query
     * @returns The SQL query string.
     */
    makeDeleteQuery() {
        let sql = `DELETE FROM \`${this.queryObject.table}\` `;
        sql += this.makeWhere(this.queryObject);
        return this.sql = sql + ';';
    }

    /**
     * Given a query object, return a SQL query string
     * @returns The query string.
     */
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

    /**
     * This function takes the query object and converts it to a SQL string
     * @returns The SQL query that was generated.
     */
    getSql() {
        this.queryToSql();

        this.resetQuery();
        if(this.tableName) {
            this.table(this.tableName);
        }

        return this.sql;
    }

    /**
     * Truncate() truncates the table
     * @returns The result of the query.
     */
    truncate() {
        return this.executeRaw(`TRUNCATE \`${this.tableName}\``);
    }
}

module.exports = MysqlQueryBuilder;