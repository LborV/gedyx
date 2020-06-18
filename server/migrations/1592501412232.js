
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
    {table: 'temp', drop: false, name: 'data', type: 'date'},
    {table: 'temp', drop: false, name: 'temp', type: 'float'},
    {table: 'temp', drop: false, name: 'camera', type: 'text'},
    {table: 'temp', drop: false, name: 'pacient_id', type: 'int'}
]);
