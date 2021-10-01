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
                if(globalThis.redisConnection) {
                    this.sessions = new RedisQueryBuilder({connection: globalThis.redisConnection});            
                }
                break;
            case 'mysql':
                if(globalThis.mysqlConnection) {
                    this.sessions = new MysqlQueryBuilder({connection: globalThis.mysqlConnection, table: 'sessions'});            
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
                                .select('data')
                                .where('sessionKey', sessionKey)
                                .execute();

                            if(result[0] && result[0].data) {
                                return result[0].data;
                            }

                            return [];
                        }

                        this.sessions.set = async (sessionKey, data) => {
                            let session = await this.sessions.get(sessionKey);
                            if(!session || session.length == 0) {
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