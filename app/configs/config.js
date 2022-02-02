//Settings for DB connection
var configs = {
    "mysql": {
        'main': {
            host: "mysql_database",
            user: "root",
            password: "testRootPassword",
            db: "testDatabase",
            connectionLimit: 1,
            waitForConnections: true,
            queueLimit: 10
        },
        'second': {
            host: "mysql_database",
            user: "root",
            password: "testRootPassword",
            db: "testDatabase",
            connectionLimit: 10
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
        'redis': {
            port: 6379,
            host: "redis",
            password: "",
        }   
    },
    // You want only one node to run cron
    "cron": process.argv.slice(2)[1] === 'cronEnabled',
    "http": {
        'api': {
            'static': true,
            'port': 80
        },
        'health': {
            'static': false,
            'port': 8001
        }
    }
};

module.exports = configs;