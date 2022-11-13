class QueryBuilder {
    /**
     * The constructor function creates a new object and sets the query property to an empty object
     * @returns The object itself.
     */
    constructor() {
        this.resetQuery();
        return this;
    }

    /**
     * Reset the query object to its default values
     */
    resetQuery() {
        this.queryObject = {
            select: [],
            table: '',
            where: [],
            join: [],
            order: [],
            update: [],
            limit: null,
            insert: [],
            delete: false,
            union: null,
            group: [],
            forUpdate: false,
            forShare: false
        };
    }

    /**
     * Set the forUpdate flag to true
     * @returns The query object.
     */
    lockForUpdate() {
        this.queryObject.forUpdate = true;
        this.queryObject.forShare = false;
        return this;
    }

    /**
     * Set the lock mode to "shared" for the query
     * @returns The query object.
     */
    sharedLock() {
        this.queryObject.forUpdate = false;
        this.queryObject.forShare = true;
        return this;
    }

    /**
     * The delete() function sets the delete property of the query object to true
     * @returns The query builder object.
     */
    delete() {
        this.queryObject.delete = true;
        return this;
    }

    /**
     * It updates the query object with the update object.
     * @param updObject - The object that contains the key/value pairs to update.
     * @returns The query builder object.
     */
    update(updObject) {
        if(typeof updObject !== 'object' || updObject === null) {
            throw 'Not an object';
        }

        Object.keys(updObject).forEach(key => {
            this.queryObject.update.push([key, updObject[key]]);
        });

        return this;
    }

    /**
     * Inserts the given object into the query object
     * @param inObject - The object to insert.
     * @returns The query builder object.
     */
    insert(inObject) {
        if(typeof inObject !== 'object' || inObject === null) {
            throw 'Not an object';
        }

        Object.keys(inObject).forEach(key => {
            let value = inObject[key];
            this.queryObject.insert.push([key, value]);
        });

        return this;
    }

    /**
     * This function sets the table name for the query
     * @param tableName - The name of the table to be queried.
     * @returns This is returning the query object.
     */
    table(tableName) {
        if(typeof tableName != 'string') {
            throw 'Table Name most be a String';
        }

        this.queryObject.table = tableName;
        return this;
    }

    /**
     * It adds the selected items to the query object.
     * @returns The query object.
     */
    select() {
        for(var i = 0; i < arguments.length; i++) {
            let arg = arguments[i];
            if(Array.isArray(arg)) {
                arg.forEach(item => {
                    this.select(item);
                });
            } else if(typeof arg === 'string') {
                this.queryObject.select.push(arg);
            } else {
                throw 'Inccorect input';
            }
        }

        return this;
    }

    /**
     * Adds a raw value to the select array
     * @param str - The string to be added to the select array.
     * @returns The query object.
     */
    selectRaw(str) {
        if(typeof str !== 'string') {
            throw 'Incorrect input';
        }

        this.queryObject.select.push({
            value: str,
            raw: true
        });

        return this;
    }

    /**
     * It adds a where clause to the query object.
     * @returns The query object.
     */
    where() {
        let isOr = false;
        if(this.nextQueryOr) {
            this.nextQueryOr = false;
            isOr = true;
        }

        if(arguments.length == 1) {
            if(typeof arguments[0] === 'function') {
                this.queryObject.where.push({
                    subWhere: arguments[0](new QueryBuilder()).getQueryObject(),
                    isOr: isOr
                });

                return this;
            }
        }

        if(arguments.length == 2) {
            if(typeof arguments[0] !== 'string') {
                throw 'First parameter must be string';
            }

            if(typeof arguments[1] === 'function') {
                this.queryObject.where.push({
                    a1: arguments[0],
                    operator: '=',
                    subWhere: arguments[1](new QueryBuilder()).getQueryObject(),
                    isOr: isOr
                });

                return this;
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

            if(typeof arguments[2] === 'function') {
                this.queryObject.where.push({
                    a1: arguments[0],
                    operator: arguments[1],
                    subWhere: arguments[2](new QueryBuilder()).getQueryObject(),
                    isOr: isOr
                });

                return this;
            }

            if(typeof arguments[2] !== 'string' && typeof arguments[2] !== 'number') {
                throw 'Incorrect input';
            }

            this.queryObject.where.push({
                a1: arguments[0],
                a2: arguments[2],
                operator: arguments[1],
                isOr: isOr
            });

            return this;
        }

        throw 'Incorrect number of arguments';
    }

    /**
     * Add an raw order by clause to the query
     * @param a1 - The field to order by.
     * @returns The query object.
     */
    orderRaw(a1) {
        if(typeof a1 !== 'string') {
            throw 'Incorrect input';
        }

        this.queryObject.order.push({ value: a1, type: 'RAW' });
        return this;
    }

    /**
     * Add an order by clause to the query
     * @param a1 - The field to order by.
     * @returns The query object.
     */
    orderBy(a1) {
        if(typeof a1 !== 'string') {
            throw 'Incorrect input';
        }

        this.queryObject.order.push({ value: a1, type: 'ASC' });
        return this;
    }

    /**
     * This function adds a descending order by clause to the query object
     * @param a1 - The column name to order by.
     * @returns The query object.
     */
    orderByDesc(a1) {
        if(typeof a1 !== 'string') {
            throw 'Incorrect input';
        }

        this.queryObject.order.push({ value: a1, type: 'DESC' });
        return this;
    }

    /**
     * It takes two arguments. The first argument is the offset and the second argument is the limit. If
     * the first argument is not provided, it is set to 0. If the second argument is not provided, it is
     * set to 10
     * @returns The query object.
     */
    limit() {
        if(arguments.length !== 2 && arguments.length !== 1) {
            throw 'Incorrect arguments count';
        }

        let offset = undefined;
        let num = undefined;

        if(arguments.length == 2) {
            offset = arguments[0];
            num = arguments[1];
        }

        if(arguments.length == 1) {
            num = arguments[0];
        }

        if(offset && typeof offset !== 'number') {
            throw 'Offset should be a number';
        }

        if(typeof num !== 'number') {
            throw 'Limit should be a number';
        }

        this.queryObject.limit = {
            offset: offset,
            limit: num
        };
        return this;
    }

    /**
     * @param a1 - The first argument.
     * @param a2 - The value to be compared to a1.
     * @returns The query string.
     */
    whereLike(a1, a2) {
        if(typeof a1 !== 'string' || typeof a2 !== 'string') {
            throw 'Incorrect input';
        }

        return this.where(a1, 'LIKE', `'${a2}'`);
    }

    /**
     * This function is used to add a "or where" clause to the query
     * @returns The query builder object
     */
    orWhere() {
        this.nextQueryOr = true;
        return this.where(...arguments)
    }

    /**
     * Given a string and an array, return a where clause that checks if the string is in the array
     * @param a1 - The column name
     * @param a2 - The array of values to check against.
     * @returns The query object.
     */
    whereIn(a1, a2) {
        if(typeof a1 !== 'string' || !Array.isArray(a2)) {
            throw 'Incorrect input';
        }

        return this.where(a1, 'IN', '(' + a2.map((item) => { return typeof item === 'string' ? `'${item}'` : item }).join(', ') + ')');
    }

    /**
     * @param a1 - The column name.
     * @param a2 - The array of values to be used in the WHERE clause.
     * @returns The query string.
     */
    whereNotIn(a1, a2) {
        if(typeof a1 !== 'string' || !Array.isArray(a2)) {
            throw 'Incorrect input';
        }

        return this.where(a1, 'NOT IN', '(' + a2.map((item) => {
            if(typeof item === 'string') {
                return `'${item}'`;
            }

            if(typeof item === 'number') {
                return item;
            }

            throw 'Incorrect input';
        }).join(', ') + ')');
    }

    /**
     * Given a string, return a new query object with the given string as a condition
     * @param a1 - The column name to be used in the where clause.
     * @returns The query object
     */
    whereNull(a1) {
        if(typeof a1 !== 'string') {
            throw 'Incorrect input';
        }

        return this.where(a1, 'IS', 'NULL')
    }

    /**
     * It adds a where clause to the query object.
     * @param sql - The raw SQL string to be used in the where clause.
     * @returns The query builder object.
     */
    whereRaw(sql) {
        if(typeof sql !== 'string') {
            throw 'Must be a string';
        }

        this.queryObject.where.push(sql);
        return this;
    }

    /**
     * Given a column name, return a new QueryBuilder instance with the WHERE clause set to filter out rows
     * where the given column is null
     * @param a1 - The column name.
     * @returns The query builder object.
     */
    whereNotNull(a1) {
        if(typeof a1 !== 'string') {
            throw 'Incorrect input';
        }

        return this.where(a1, 'IS NOT', 'NULL')
    }

    /**
     * Get the query object from the URL
     * @returns The query object.
     */
    getQueryObject() {
        return this.queryObject;
    }

    /**
     * This function allows you to union the results of two queries
     * @param callback - A function that returns a QueryBuilder object.
     * @returns The query builder object.
     */
    union(callback) {
        if(typeof callback !== 'function') {
            throw 'Incorrect input';
        }

        this.queryObject.union = {
            value: callback(new QueryBuilder()).getQueryObject(),
            all: false
        };
        return this;
    }

    /**
     * This function allows you to union all the results of a query with another query
     * @param callback - A function that takes a new QueryBuilder instance as an argument.
     * @returns The query builder object.
     */
    unionAll(callback) {
        if(typeof callback !== 'function') {
            throw 'Incorrect input';
        }

        this.queryObject.union = {
            value: callback(new QueryBuilder()).getQueryObject(),
            all: true
        };
        return this;
    }

    /**
     * This function takes a string as an input and sets the groupBy property of the queryObject to that
     * string
     * @param a1 - The name of the field to group by.
     * @returns The query builder object.
     */
    groupBy(a1) {
        if(typeof a1 !== 'string') {
            throw 'Inccorect input';
        }

        this.queryObject.group.push(a1);

        return this;
    }

    /**
     * It takes a table name and a callback function. The callback function takes a QueryBuilder object and
     * returns a QueryObject. The QueryObject is then added to the join array
     * @param table - The table to join with.
     * @param callback - A function that returns a QueryBuilder object.
     * @returns The query builder object.
     */
    join(table, callback, tableRaw = false) {
        if(typeof table !== 'string' || typeof callback !== 'function') {
            throw 'Inccorect input';
        }

        this.queryObject.join.push({
            table: table,
            tableRaw: tableRaw,
            value: callback(new QueryBuilder()).getQueryObject(),
            operator: 'JOIN'
        });

        return this;
    }

    /**
     * It takes a table name and a callback function. The callback function takes a QueryBuilder object and
     * returns a QueryBuilder object. The function then adds the table name and the callback function's
     * return value to the query object
     * @param table - The table to join with.
     * @param callback - A function that will be called with a new QueryBuilder instance.
     * @returns The query builder object.
     */
    leftJoin(table, callback, tableRaw = false) {
        if(typeof table !== 'string' || typeof callback !== 'function') {
            throw 'Inccorect input';
        }

        this.queryObject.join.push({
            table: table,
            tableRaw: tableRaw,
            value: callback(new QueryBuilder()).getQueryObject(),
            operator: 'LEFT JOIN'
        });

        return this;
    }

    /**
     * This function adds a right join to the query
     * @param table - The table to join with.
     * @param callback - A function that returns a QueryBuilder object.
     * @returns The query builder object.
     */
    rightJoin(table, callback, tableRaw = false) {
        if(typeof table !== 'string' || typeof callback !== 'function') {
            throw 'Inccorect input';
        }

        this.queryObject.join.push({
            table: table,
            tableRaw: tableRaw,
            value: callback(new QueryBuilder()).getQueryObject(),
            operator: 'RIGHT JOIN'
        });

        return this;
    }

    /**
     * It takes a table name and a callback function. The callback function takes a QueryBuilder object and
     * returns a QueryBuilder object. The function then creates a new QueryBuilder object and returns it.
     * The function then adds the new QueryBuilder object to the join array
     * @param table - The table to join with.
     * @param callback - A function that takes a QueryBuilder as an argument.
     * @returns The query builder object.
     */
    innerJoin(table, callback, tableRaw = false) {
        if(typeof table !== 'string' || typeof callback !== 'function') {
            throw 'Inccorect input';
        }

        this.queryObject.join.push({
            table: table,
            tableRaw: tableRaw,
            value: callback(new QueryBuilder()).getQueryObject(),
            operator: 'INNER JOIN'
        });

        return this;
    }
}

module.exports = QueryBuilder;