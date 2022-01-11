/**
 * 
 */
class QueryBuilder {
    /**
     * 
     * @returns {Object}
     */
    constructor() {
        this.resetQuery();
        return this;
    }

    /**
     * 
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
            group: null
        };
    }

    /**
     * 
     * @returns {Object}
     */
    delete() {
        this.queryObject.delete = true;
        return this;
    }

    /**
     * 
     * @returns {Object}
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
     * 
     * @param {Object} inObject 
     * @returns {Object}
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
     * 
     * @param {String} tableName 
     * @returns {Object}
     */
    table(tableName) {
        if(typeof tableName != 'string') {
            throw 'Table Name most be a String';
        }

        this.queryObject.table = tableName;
        return this;
    }

    /**
     * 
     * @returns {Object}
     */
    select() {
        for(var i = 0; i < arguments.length; i++) {
            let arg = arguments[i];
            if(Array.isArray(arg)) {
                arg.forEach(item =>{
                    this.select(item);
                });
            } else if (typeof arg === 'string') {
                this.queryObject.select.push(arg);                
            } else {
                throw 'Inccorect input';
            }
        }

        return this;
    }

    /**
     * 
     * @param {String} str 
     * @returns {Object}
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
     * @param {Function} arguments
     * @param {String|Function} arguments 
     * @param {String|Any} arguments 
     * @param {String|String|Any} arguments 
     * @param {String|String|Function} arguments 
     * @returns {Object}
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
     * 
     * @param {String} a1 
     * @returns {Object} 
     */
    orderBy(a1) {
        if(typeof a1 !== 'string') {
            throw 'Incorrect input';
        }

        this.queryObject.order.push({value: a1, type: 'ASC'});
        return this;
    }

    /**
     * 
     * @param {String} a1 
     * @returns {Object}
     */
    orderByDesc(a1) {

        if(typeof a1 !== 'string') {
            throw 'Incorrect input';
        }

        this.queryObject.order.push({value: a1, type: 'DESC'});
        return this;
    }

    /**
     * @param {Number} arguments
     * @param {Number|Number} arguments
     * @returns {Object}
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
     * 
     * @param {String} a1 
     * @param {String} a2 
     * @returns {Object}
     */
    whereLike(a1, a2) {
        if(typeof a1 !== 'string' || typeof a2 !== 'string') {
            throw 'Incorrect input';
        }

        return this.where(a1, 'LIKE', `'${a2}'`);
    }

    /**
     * @param {Function} arguments
     * @param {String|Function} arguments 
     * @param {String|Any} arguments 
     * @param {String|String|Any} arguments 
     * @param {String|String|Function} arguments 
     * @returns {Object}
     */
    orWhere() {
        this.nextQueryOr = true;
        return this.where(...arguments)
    }

    /**
     * 
     * @param {String} a1 
     * @param {Array} a2 
     * @returns {Object}
     */
    whereIn(a1, a2) {
        if(typeof a1 !== 'string' || !Array.isArray(a2)) {
            throw 'Incorrect input';
        }
        
        return this.where(a1, 'IN', '('+a2.map((item) => {return typeof item === 'string' ? `'${item}'` : item}).join(', ')+')');
    }

    /**
     * 
     * @param {String} a1 
     * @param {Array} a2 
     * @returns {Object}
     */
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

            throw 'Incorrect input';
        }).join(', ')+')');
    }

    /**
     * 
     * @param {String} a1 
     * @returns {Object}
     */
    whereNull(a1) {
        if(typeof a1 !== 'string') {
            throw 'Incorrect input';
        }

        return this.where(a1, 'IS', 'NULL')
    }

    /**
     * 
     * @param {String} sql 
     * @returns {Object}
     */
    whereRaw(sql) {
        if(typeof sql !== 'string') {
            throw 'Must be a string';
        }

        this.queryObject.where.push(sql);
        return this;
    }

    /**
     * 
     * @param {String} a1 
     * @returns {Object}
     */
    whereNotNull(a1) {
        if(typeof a1 !== 'string') {
            throw 'Incorrect input';
        }

        return this.where(a1, 'IS NOT', 'NULL')
    }

    /**
     * 
     * @returns {Object}
     */
    getQueryObject() {
        return this.queryObject;
    }

    /**
     * 
     * @param {Function} callback - Must return QueryBuilder
     * @returns {Object}
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
     * 
     * @param {Function} callback - Must return QueryBuilder
     * @returns {Object}
     */
    unionAll(callback) {
        if(typeof callback !== 'function') {
            throw 'Inccorect input';
        }

        this.queryObject.union = {
            value: callback(new QueryBuilder()).getQueryObject(),
            all: true
        };
        return this;
    }

    /**
     * 
     * @param {String} a1 
     * @returns {Object}
     */
    groupBy(a1) {
        if(typeof a1 !== 'string') {
            throw 'Inccorect input';
        }

        this.queryObject.group = a1;

        return this;
    }

    /**
     * 
     * @param {String} table 
     * @param {Function} callback - Must return QueryBuilder
     * @returns {Object}
     */
    join(table, callback) {
        if(typeof table !== 'string' || typeof callback !== 'function') {
            throw 'Inccorect input';
        }

        this.queryObject.join.push({
            table: table,
            value: callback(new QueryBuilder()).getQueryObject(),
            operator: 'JOIN'
        });

        return this;
    }

    /**
     * 
     * @param {String} table 
     * @param {Function} callback - Must return QueryBuilder
     * @returns {Object}
     */
    leftJoin(table, callback) {
        if(typeof table !== 'string' || typeof callback !== 'function') {
            throw 'Inccorect input';
        }

        this.queryObject.join.push({
            table: table,
            value: callback(new QueryBuilder()).getQueryObject(),
            operator: 'LEFT JOIN'
        });

        return this;
    }

    /**
     * 
     * @param {String} table 
     * @param {Function} callback - Must return QueryBuilder
     * @returns {Object}
     */
    rightJoin(table, callback) {
        if(typeof table !== 'string' || typeof callback !== 'function') {
            throw 'Inccorect input';
        }

        this.queryObject.join.push({
            table: table,
            value: callback(new QueryBuilder()).getQueryObject(),
            operator: 'RIGHT JOIN'
        });

        return this;
    }

    /**
     * 
     * @param {String} table 
     * @param {Function} callback - Must return QueryBuilder
     * @returns {Object}
     */
    innerJoin(table, callback) {
        if(typeof table !== 'string' || typeof callback !== 'function') {
            throw 'Inccorect input';
        }

        this.queryObject.join.push({
            table: table,
            value: callback(new QueryBuilder()).getQueryObject(),
            operator: 'INNER JOIN'
        });

        return this;
    }
}

module.exports = QueryBuilder;