var model = require('./kernel/model-db.js');
var config = require('./configs/config.js');

var base = new model({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.db,
});

base.setTables([
    'customer_activity_emails',
    'customer_attributes'
])

console.log(base.loadAll());