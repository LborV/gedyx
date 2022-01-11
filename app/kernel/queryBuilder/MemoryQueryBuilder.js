const QueryBuilder = require('./QueryBuilder');
/**
 * 
 */
class MemoryQueryBuilder extends QueryBuilder {
   /**
    * 
    * @param {Object} config 
    */
    constructor(config) {
        super();
        this.connection = config.connection;
        this.data = [];
    }

    /**
     * 
     * @param {String} key 
     * @param {Any} value 
     */
    set(key, value) {
        if(typeof key !== 'string') {
            throw 'Incorrect key';
        }

        this.data[key] = value;
    }

    /**
     * 
     * @param {String} key 
     * @returns {Any}
     */
    get(key) {
        if(typeof key !== 'string') {
            throw 'Incorrect key';
        }

        return this.data[key] ? this.data[key] : [];
    }

    /**
     * 
     */
    truncate() {
        this.data = [];
    }

    /**
     * 
     * @returns {Object}
     */
    all() {
        return this.data;
    }

    /**
     * 
     * @param {String} _key 
     * @returns {Object} 
     */
    delete(_key) {
        if(typeof key !== 'string') {
            throw 'Incorrect key';
        }

        var data = [];
        for(const [key, value] of Object.entries(this.data)) {
            if(value.id != _key) {
                data[key] = value;
            }
        }

        return this.data = data;
    }
}

module.exports = MemoryQueryBuilder;