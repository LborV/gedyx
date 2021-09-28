const QueryBuilder = require('./QueryBuilder');
class RedisQueryBuilder extends QueryBuilder {
    constructor(config) {
        super();
        this.connection = config.connection;
        this.sql = '';
    }

    set(key, value) {
        if(typeof key !== 'string') {
            throw 'Incorrect key';
        }

        this.connection.set(key, JSON.stringify(value));
    }

    async get(key) {
        if(typeof key !== 'string') {
            throw 'Incorrect key';
        }

        let result;
        await this.connection.get(key).then((data) => {
            result = data ? JSON.parse(data) : [];
        });

        return result;
    }

    delete(key) {
        if(typeof key !== 'string') {
            throw 'Incorrect key';
        }

        return this.connection.del(key);
    }
    
    truncate() {
        this.connection.flushdb((err, succeeded) => {
            if(!succeeded) {
                console.error(err);
            }
        });
    }
}

module.exports = RedisQueryBuilder;