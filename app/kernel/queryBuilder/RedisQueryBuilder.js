class RedisQueryBuilder extends QueryBuilder {
    constructor(config) {
        super();
        this.connection = config.connection;
        this.sql = '';
    }

    set(key, value) {
        if(typeof key !== 'string') {
            throw 'Inncorrect key';
        }

        this.connection.set(key, JSON.stringify(value));
    }

    async get(key) {
        if(typeof key !== 'string') {
            throw 'Inncorrect key';
        }

        let result;
        await this.connection.get(key).then((data) => {
            result = data ? JSON.parse(data) : [];
        });

        return result;
    }

    delete(key) {
        if(typeof key !== 'string') {
            throw 'Inncorrect key';
        }

        return this.connection.del(key);
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