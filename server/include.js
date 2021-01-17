//In this file will be aotomaticaly included your models
global.config = require('./configs/config.js');

//Mysql Connection
const mysql = require('sync-mysql');
global.mysqlConnection = new mysql({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.db,
});


global.ModelInterface = require('./kernel/interfaces/ModelInterface');
global.actions = require('./kernel/actions.js');
global.test_table = require('./models/testTable');