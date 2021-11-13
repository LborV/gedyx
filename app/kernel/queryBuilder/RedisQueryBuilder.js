const QueryBuilder = require('./QueryBuilder');
class RedisQueryBuilder extends QueryBuilder {
    constructor(config) {
        super();
        this.connection = config.connection;
        this.sql = '';
    }

    set(key, value, connection = null) {
        if(typeof key !== 'string') {
            throw 'Incorrect key';
        }

        if(connection == null) {
            this.connection.set(key, JSON.stringify(value));
        } else {
            connection.set(key, JSON.stringify(value));
        }
    }

    async get(key, connection = null) {
        if(typeof key !== 'string') {
            throw 'Incorrect key';
        }

        let result;
        if(connection == null) {
            await this.connection.get(key).then((data) => {
                result = data ? JSON.parse(data) : [];
            });        
        } else {
            await connection.get(key).then((data) => {
                result = data ? JSON.parse(data) : [];
            });
        }

        return result;
    }

    delete(key, connection = null) {
        if(typeof key !== 'string') {
            throw 'Incorrect key';
        }

        if(connection == null) {
            return this.connection.del(key);
        }

        return connection.del(key);
    }
    
    truncate(connection = null) {
        if(connection == null) {
            this.connection.flushdb((err, succeeded) => {
                if(!succeeded) {
                    console.error(err);
                }
            });
        } else {
            connection.flushdb((err, succeeded) => {
                if(!succeeded) {
                    console.error(err);
                }
            });
        }
    }
}

module.exports = RedisQueryBuilder;