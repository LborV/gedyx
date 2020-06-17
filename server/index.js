var model = require('./kernel/model-db.js');
var config = require('./configs/config.js');

var base = new model({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.db,
});

console.log(base.loadAll());