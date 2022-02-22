const QueryBuilder = require('./QueryBuilder');
class RedisQueryBuilder extends QueryBuilder {
    /**
     * The constructor function creates a new instance of the class and assigns the connection object to
     * the connection property
     * @param config - The configuration object that was passed to the constructor.
     */
    constructor(config) {
        super();
        this.connection = config.connection;
        this.sql = '';
    }

    /**
     * Set a value in the database
     * @param key - The key to set.
     * @param value - The value to be stored in the cache.
     * @param [connection=null] - The connection object to use. If not specified, the default connection is
     * used.
     */
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

    /**
     * Get the value of a key from the database
     * @param key - The key to get the value from.
     * @param [connection=null] - The connection to the Redis server.
     * @returns An array of objects.
     */
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

    /**
     * Delete a key from the database
     * @param key - The key to delete.
     * @param [connection=null] - A redis client object. If not provided, the default connection will be
     * used.
     * @returns The number of keys that were removed.
     */
    delete(key, connection = null) {
        if(typeof key !== 'string') {
            throw 'Incorrect key';
        }

        if(connection == null) {
            return this.connection.del(key);
        }

        return connection.del(key);
    }
    
    /**
     * It flushes the database
     * @param [connection=null] - A connection to a Redis server. If not provided, the default connection will be
     * used.
     */
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