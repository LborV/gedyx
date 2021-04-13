//Settings for DB connection
var configs = {
    "mysql": {
        host: "localhost",
        user: "MyUser",
        password: "MyPass",
        db: "MyDb"
    },
    "socket": {
        "port": 3030
    },
    "redis": {
        port: 6379,
        host: '120.0.0.1',
        password: '123',   
    }
};

module.exports = configs;