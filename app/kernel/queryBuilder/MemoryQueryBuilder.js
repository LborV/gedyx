const QueryBuilder = require('./QueryBuilder');
class MemoryQueryBuilder extends QueryBuilder {
    /**
    * It creates a new instance of the class and passes in the config object.
    * @param config - The configuration object passed to the constructor.
    */
    constructor(config) {
        super();
        this.connection = config.connection;
        this.data = [];
    }

    /**
     * Set the value of a key in the data object
     * @param key - The key to set.
     * @param value - The value to be set.
     */
    set(key, value) {
        if(typeof key !== 'string') {
            throw 'Incorrect key';
        }

        this.data[key] = value;
    }

    /**
     * Get the value of the key from the data object
     * @param key - The key to get the value for.
     * @returns The value of the key if it exists, otherwise an empty array.
     */
    get(key) {
        if(typeof key !== 'string') {
            throw 'Incorrect key';
        }

        return this.data[key] ? this.data[key] : [];
    }

    /**
     * Truncate the data array
     */
    truncate() {
        this.data = [];
    }

    /**
     * Return the entire data array
     * @returns The data array.
     */
    all() {
        return this.data;
    }

    /**
     * Delete the value with the given key
     * @param _key - The key of the object to be deleted.
     * @returns Nothing.
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