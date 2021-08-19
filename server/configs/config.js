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
        host: "redis",
        password: "",   
    }
};

module.exports = configs;