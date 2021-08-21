const QueryBuilder = require('./QueryBuilder');
class MemmoryQueryBuilder extends QueryBuilder {
    constructor(config) {
        super();
        this.connection = config.connection;
        this.data = [];
    }

    set(key, value) {
        if(typeof key !== 'string') {
            throw 'Inncorrect key';
        }

        this.data[key] = value;
    }

    get(key) {
        if(typeof key !== 'string') {
            throw 'Inncorrect key';
        }

        return this.data[key] ? this.data[key] : [];
    }

    truncate() {
        this.data = [];
    }

    all() {
        return this.data;
    }

    delete(key) {
        if(typeof key !== 'string') {
            throw 'Inncorrect key';
        }

        delete this.data[key];
    }
}

module.exports = MemmoryQueryBuilder;