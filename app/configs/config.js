//Settings for DB connection
var configs = {
    "mysql": {
        'main': {
            host: "mysql_database",
            user: "root",
            password: "testRootPassword",
            db: "testDatabase"
        },
        'second': {
            host: "mysql_database",
            user: "root",
            password: "testRootPassword",
            db: "testDatabase"
        }
    },
    "socket": {
        port: 3030,
        useSession: true,
        session: {
            expiration: 1000*60*60,
            type: 'redis'
        },
        server: {
            // Socket io configurations 
            path: process.argv.slice(2)[0]
        }
    },
    "redis": {
        'main': {
            port: 6379,
            host: "redis",
            password: "",
        }   
    }
};

module.exports = configs;