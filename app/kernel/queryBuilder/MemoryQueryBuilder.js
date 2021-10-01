const QueryBuilder = require('./QueryBuilder');
class MemoryQueryBuilder extends QueryBuilder {
    constructor(config) {
        super();
        this.connection = config.connection;
        this.data = [];
    }

    set(key, value) {
        if(typeof key !== 'string') {
            throw 'Incorrect key';
        }

        this.data[key] = value;
    }

    get(key) {
        if(typeof key !== 'string') {
            throw 'Incorrect key';
        }

        return this.data[key] ? this.data[key] : [];
    }

    truncate() {
        this.data = [];
    }

    all() {
        return this.data;
    }

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