var model = require('./kernel/migration.js');
var config = require('./configs/config.js');

var base = new model({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.db,
}, true);

base.migrate([
    {table: 'test', drop: false, name: 'test', type: 'text', action: 'MODIFY'}
]);