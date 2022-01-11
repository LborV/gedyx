const MemoryStorage = require('./queryBuilder/MemoryQueryBuilder');
const MysqlQueryBuilder = require('./queryBuilder/MysqlQueryBuilder');
const RedisQueryBuilder = require('./queryBuilder/RedisQueryBuilder');
const sha1 = require('sha1');
/**
 * 
 */
class Sessions {
    /**
     * 
     * @param {Object} config 
     */
    constructor(config) {
        this.expiration = 1000*60*60;
        if(config.expiration != undefined && config.expiration) {
            this.expiration = parseInt(config.expiration);
        }
        let connection = undefined;
        let connectionName = undefined;

        switch(config.type) {
            case 'redis': 
                if(globalThis.config && globalThis.config.redis) {
                    connectionName = Object.keys(globalThis.config.redis)[0];
                }
            
                if(config.connection) {
                    if(typeof config.connection === 'string') {
                        connectionName = config.connection;
                    } else {
                        connection = config.connection;
                    }
                }

                if(!connection) {
                    connection = globalThis[connectionName];
                }

                if(connection) {
                    this.sessions = new RedisQueryBuilder({connection: connection});            
                }
                break;
            case 'mysql':
                if(globalThis.config && globalThis.config.mysql) {
                    connectionName = Object.keys(globalThis.config.mysql)[0];
                }
            
                if(config.connection) {
                    if(typeof config.connection === 'string') {
                        connectionName = config.connection;
                    } else {
                        connection = config.connection;
                    }
                }

                if(!connection) {
                    connection = globalThis[connectionName];
                }

                if(connection) {
                    this.sessions = new MysqlQueryBuilder({connection: connection, table: 'sessions'});            
                    this.sessions.executeRaw(`
                        SELECT 
                            TABLE_NAME 
                        FROM 
                            information_schema.TABLES
                        WHERE 
                            TABLE_SCHEMA = SCHEMA() AND 
                            TABLE_NAME = 'sessions'
                    `).then(async tables => {  
                        if(tables && tables.length == 0) {
                            await this.sessions.executeRaw(`
                                CREATE TABLE \`sessions\` (
                                    \`sessionKey\` VARCHAR(50) PRIMARY KEY UNIQUE NOT NULL,
                                    \`data\` JSON
                                );
                            `)
                            .then(result => {
                                console.log('Created "sessions" table in database!');   
                            })
                            .catch(console.error);
                        }

                        this.sessions.get = async (sessionKey) => {
                            let result = await this.sessions
                                .select('data', 'sessionKey')
                                .where('sessionKey', sessionKey)
                                .execute();

                            if(result[0] && result[0].sessionKey) {
                                return result[0].data;
                            }

                            return undefined;
                        }

                        this.sessions.set = async (sessionKey, data) => {
                            let session = await this.sessions.get(sessionKey);
                            if(session === undefined) {
                                return await this.sessions
                                    .insert({
                                        sessionKey: sessionKey,
                                        data: JSON.stringify(data)
                                    })
                                    .execute();
                            }

                            return await this.sessions
                                .update({
                                    data: JSON.stringify(data)
                                })
                                .where('sessionKey', sessionKey)
                                .execute();
                        }
                    })
                    .catch(console.error);
                }
                break;

            default:
                this.sessions = new MemoryStorage({connection: null});            
        }
    }

    /**
     * 
     * @param {String} sessionKey 
     * @param {String} key 
     * @param {Any} value 
     * @returns {Object}
     */
    async setValue(sessionKey, key, value) {
        let session = await this.get(sessionKey);
        session[key] = value;

        return await this.set(sessionKey, session);
    }

    /**
     * 
     * @param {String} sessionKey 
     * @param {Any} data 
     * @returns {Object}
     */
    async set(sessionKey, data) {
        return await this.sessions.set(sessionKey, data);
    }

    /**
     * 
     * @param {String} sessionKey 
     * @returns {Object}
     */
    async get(sessionKey) {
        let session = await this.sessions.get(sessionKey);
        if(session === undefined || session.endDate === undefined || !this.checkExpiration(session.endDate)) {
            return this.createSession();
        }

        session.endDate = Date.now() + this.expiration;
        this.sessions.set(sessionKey, session);

        return session;
    }

    /**
     * 
     * @param {Date} endDate 
     * @returns {Boolean}
     */
    checkExpiration(endDate) {
        return Date.now() <= endDate;
    }

    /**
     * 
     * @param {String} key 
     */
    forget(key) {
        this.sessions.delete(key);
    }

    /**
     * 
     */
    truncate() {
        this.sessions.truncate(key);
    }

    /**
     * 
     * @returns {Object}
     */
    createSession() {
        let sessionKey = sha1(Date.now() + '_' + Math.random().toString(36));
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