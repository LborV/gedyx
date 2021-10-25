//Settings for DB connection
var configs = {
    "mysql": {
        host: "mysql_database",
        user: "root",
        password: "testRootPassword",
        db: "testDatabase"
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
        }
    },
    "redis": {
        port: 6379,
        host: "redis",
        password: "",   
    }
};

module.exports = configs;