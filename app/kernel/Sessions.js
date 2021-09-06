const Storage = require('./queryBuilder/MemmoryQueryBuilder');

class Sessions {
    constructor(config) {
        this.expiration = 1000*60*60;
        if(config.expiration != undefined && config.expiration) {
            this.expiration = parseInt(config.expiration);
        }

        this.sessions = new Storage({connection: null});
    }

    get(sessionKey) {
        let session = this.sessions.get(sessionKey);
        if(session.length == 0 || !this.checkExpiration(session.endDate)) {
            return this.createSession();
        }

        return session;
    }

    checkExpiration(endDate) {
        return Date.now() <= endDate;
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
}

module.exports = Sessions;