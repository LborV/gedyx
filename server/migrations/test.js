
//This file was automaticaly generated
//Feel free to edit :)
var config = require('../configs/config.js');
var migration = require('../kernel/migration.js');

var _migration = new migration({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.db,
}, true);

_migration.migrate([
    {table: 'test', drop: false, name: 'a', type: 'int'},
    {table: 'test', drop: false, name: 'b', type: 'int'},
    {table: 'test', drop: false, name: 'b', type: 'text', action: 'ALTER'},
    {table: 'test', drop: false, name: 'd', type: 'int'},
    {table: 'test', drop: false, name: 'c', type: 'int'}
]);
