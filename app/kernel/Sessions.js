const MemoryStorage = require('./queryBuilder/MemoryQueryBuilder');
const MysqlQueryBuilder = require('./queryBuilder/MysqlQueryBuilder');
const RedisQueryBuilder = require('./queryBuilder/RedisQueryBuilder');

class Sessions {
    constructor(config) {
        this.expiration = 1000*60*60;
        if(config.expiration != undefined && config.expiration) {
            this.expiration = parseInt(config.expiration);
        }

        switch(config.type) {
            case 'redis': 
                this.sessions = new RedisQueryBuilder({connection: globalThis.redisConnection});            
                break;
            case 'mysql':
                // this.sessions = new RedisQueryBuilder({connection: globalThis.mysqlConnection, table: 'session'});            
                break;

            default:
                this.sessions = new MemoryStorage({connection: null});            
        }
    }

    async get(sessionKey) {
        let session = await this.sessions.get(sessionKey);
        if(session.length == 0 || !this.checkExpiration(session.endDate)) {
            return this.createSession();
        }

        session.endDate = Date.now() + this.expiration;
        this.sessions.set(sessionKey, session);

        return session;
    }

    checkExpiration(endDate) {
        return Date.now() <= endDate;
    }

    forget(key) {
        this.sessions.delete(key);
    }

    truncate() {
        this.sessions.truncate(key);
    }

    createSession() {
        let sessionKey = Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        let session = {
            liveTime: this.expiration,
            endDate: Date.now() + this.expiration,
            sessionKey: sessionKey
        };

        this.sessions.set(sessionKey, session);
        return session;
    }

    async save(session = {}) {
        if(session.sessionKey === undefined) {
            return false;
        }

        return await this.sessions.set(session.sessionKey, session);
    }
}

module.exports = Sessions;