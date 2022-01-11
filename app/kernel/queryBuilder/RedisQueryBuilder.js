const QueryBuilder = require('./QueryBuilder');
/**
 * 
 */
class RedisQueryBuilder extends QueryBuilder {
   /**
    * 
    * @param {Object} config 
    */
    constructor(config) {
        super();
        this.connection = config.connection;
        this.sql = '';
    }

    /**
     * 
     * @param {String} key 
     * @param {Any} value 
     * @param {Connection} connection 
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
     * 
     * @param {String} key 
     * @param {Connection} connection 
     * @returns {Object} 
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
     * 
     * @param {String} key 
     * @param {Connection} connection 
     * @returns {Object} 
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
     * 
     * @param {Connection} connection 
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