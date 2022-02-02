class QueryBuilder {
    constructor() {
        this.resetQuery();
        return this;
    }

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
            group: null,
            forUpdate: false,
            forShare: false
        };
    }

    lockForUpdate() {
        this.queryObject.forUpdate = true;
        this.queryObject.forShare = false;
        return this;
    }

    sharedLock() {
        this.queryObject.forUpdate = false;
        this.queryObject.forShare = true;
        return this;
    }

    delete() {
        this.queryObject.delete = true;
        return this;
    }

    update(updObject) {
        if(typeof updObject !== 'object' || updObject === null) {
            throw 'Not an object';
        }

        Object.keys(updObject).forEach(key => {
            this.queryObject.update.push([key, updObject[key]]);
        });

        return this;
    }

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

    table(tableName) {
        if(typeof tableName != 'string') {
            throw 'Table Name most be a String';
        }

        this.queryObject.table = tableName;
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
                this.queryObject.select.push(arg);                
            } else {
                throw 'Inccorect input';
            }
        }

        return this;
    }

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

    orderBy(a1) {
        if(typeof a1 !== 'string') {
            throw 'Incorrect input';
        }

        this.queryObject.order.push({value: a1, type: 'ASC'});
        return this;
    }

    orderByDesc(a1) {

        if(typeof a1 !== 'string') {
            throw 'Incorrect input';
        }

        this.queryObject.order.push({value: a1, type: 'DESC'});
        return this;
    }

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

            throw 'Incorrect input';
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

    getQueryObject() {
        return this.queryObject;
    }

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

    groupBy(a1) {
        if(typeof a1 !== 'string') {
            throw 'Inccorect input';
        }

        this.queryObject.group = a1;

        return this;
    }

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