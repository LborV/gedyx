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
            delete: false
        };
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

    limit(num) {
        if(typeof num !== 'number') {
            throw 'Limit should be a number';
        }

        this.queryObject.limit = num;
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

    getQueryObject() {
        return this.queryObject;
    }
}

module.exports = QueryBuilder;