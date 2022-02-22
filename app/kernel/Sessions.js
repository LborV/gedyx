/* Sessions is a class that handles the creation of sessions */
const MemoryStorage = require('./queryBuilder/MemoryQueryBuilder');
const MysqlQueryBuilder = require('./queryBuilder/MysqlQueryBuilder');
const RedisQueryBuilder = require('./queryBuilder/RedisQueryBuilder');
var sha1 = require('sha1');

class Sessions {
    /**
     * 
     * @returns Nothing is being returned.
     */
    constructor() {
        return this;
    }

    /**
     * It initializes the session manager.
     * @param config - The configuration object.
     * @returns The return value is the object that is being created.
     */
    async init(config) {
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
                    let tables = await this.sessions.executeRaw(`
                        SELECT 
                            TABLE_NAME 
                        FROM 
                            information_schema.TABLES
                        WHERE 
                            TABLE_SCHEMA = SCHEMA() AND 
                            TABLE_NAME = 'sessions'
                    `);

                    if(tables && tables.length == 0) {
                        try {
                            await this.sessions.executeRaw(`
                                CREATE TABLE \`sessions\` (
                                    \`sessionKey\` VARCHAR(50) PRIMARY KEY UNIQUE NOT NULL,
                                    \`data\` JSON
                                );
                            `);

                            console.log('Created "sessions" table in database!');   
                        } catch(error) {
                            console.error(error);
                        }
                    }

                    this.sessions.get = async (sessionKey, connection = null) => {
                        try {
                            let result = await this.sessions
                                .select('data', 'sessionKey')
                                .where('sessionKey', sessionKey)
                                .execute(connection);

                            if(result[0] && result[0].sessionKey) {
                                return result[0].data;
                            }

                            return undefined;
                        } catch(error) {
                            console.error(error);
                        }
                    }

                    this.sessions.set = async (sessionKey, data) => {
                        let connection = await this.sessions.startTransaction();
                        try {
                            let session = await this.sessions.get(sessionKey, connection);
                            let result = undefined;
                            
                            if(session === undefined) {
                                result = await this.sessions
                                    .insert({
                                        sessionKey: sessionKey,
                                        data: JSON.stringify(data)
                                    })
                                    .execute(connection);
                            } else {
                                result = await this.sessions
                                    .update({
                                        data: JSON.stringify(data)
                                    })
                                    .where('sessionKey', sessionKey)
                                    .execute(connection);
                            }

                            await this.sessions.commit(connection);
                            return result;
                        } catch (err) {
                            this.sessions.rollback(connection);
                            console.error(err);
                        }
                    }
                }
                break;

            default:
                this.sessions = new MemoryStorage({connection: null});            
        }

        return this;
    }

    /**
        * It sets the value of a key in a session.
        * @param sessionKey - The key of the session to set the value for.
        * @param key - The key to set the value for.
        * @param value - The value to set.
        * @returns The session object.
        */
    async setValue(sessionKey, key, value) {
        let session = await this.get(sessionKey);
        session[key] = value;

        return await this.set(sessionKey, session);
    }

    /**
     * Set the data for a session
     * @param sessionKey - The key to store the session under.
     * @param data - The data to be stored in the session.
     * @returns Nothing.
     */
    async set(sessionKey, data) {
        return await this.sessions.set(sessionKey, data);
    }

    /**
     * If the session is expired, create a new session. Otherwise, return the session
     * @param sessionKey - The key to use to store the session in the cache.
     * @returns A session object.
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
     * Check if the current time is less than or equal to the end date
     * @param endDate - The date that the token expires.
     * @returns The boolean value of the checkExpiration function.
     */
    checkExpiration(endDate) {
        return Date.now() <= endDate;
    }

    /**
     * Forget() removes a key from the sessions map
     * @param key - The key to store the session under.
     */
    forget(key) {
        this.sessions.delete(key);
    }

    /**
     * Truncate session
     */
    truncate() {
        this.sessions.truncate(key);
    }

    /**
     * Create a new session and add it to the sessions map
     * @returns A session object.
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

    /**
     * Save a session to the database
     * @param [session] - The session object to be saved.
     * @returns The promise of the set method.
     */
    async save(session = {}) {
        if(session.sessionKey === undefined) {
            return false;
        }

        return await this.sessions.set(session.sessionKey, session);
    }
}

module.exports = Sessions;