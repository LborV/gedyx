class MemmoryQueryBuilder extends QueryBuilder {
    constructor(config) {
        super();
        this.connection = config.connection;
        this.data = [];
    }

    set(key, value) {
        this.data[key] = value;
    }

    get(key) {
        return this.data[key];
    }

    truncate() {
        this.data = [];
    }

    all() {
        return this.data;
    }
}

module.exports = MemmoryQueryBuilder;