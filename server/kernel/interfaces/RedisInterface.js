class RedisInterface extends ModelInterface {
    constructor(config) {
        super();
        if(!Array.isArray(config.data)) {
            if(config.table === undefined || config.connection === undefined) {
                return undefined;
            }

            this.table = config.table;
            this.prefix = this.table + '_';
            this.connection = config.connection;
        }
    }

    set(index, field, value) {
        this.connection.set(this.prefix + index, field ?? value);
        return this;
    }

    async get(index) {
        return await this.connection.get(this.prefix + index);
    }
}

module.exports = RedisInterface;
