class QueryBuilder {
    constructor() {
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
            let value = updObject[key];
            if(typeof value === 'string') {
                value = `'${value}'`;
            }

            this.queryObject.update.push([`${key}`, value]);
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
}

module.exports = QueryBuilder;