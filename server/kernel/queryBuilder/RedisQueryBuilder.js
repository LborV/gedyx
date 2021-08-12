class RedisQueryBuilder extends QueryBuilder {
    constructor(config) {
        super();
        this.connection = config.connection;
        this.sql = '';
    }

    set(key, value) {
        this.connection.set(key, value);
    }

    async get(key) {
        let result;
        await this.connection.get(key).then((data) => {
            result = data;
        });

        return result;
    }

    truncate() {
        this.connection.flushdb((err, successed) => {
            if(!successed) {
                console.error(err);
            }
        });
    }
}

module.exports = RedisQueryBuilder;