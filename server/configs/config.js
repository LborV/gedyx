//Settings for DB connection
var configs = {
    "mysql": {
        host: "mysql_database",
        user: "root",
        password: "testRootPassword",
        db: "testDatabase"
    },
    "socket": {
        port: 3030
    },
    "redis": {
        port: 6379,
        host: "120.0.0.1",
        password: "123",   
    }
};

module.exports = configs;