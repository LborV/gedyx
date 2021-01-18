//In this file will be aotomaticaly included your models
globalThis.config = require('./configs/config.js');
globalThis.ModelInterface = require('./kernel/interfaces/ModelInterface');
globalThis.Actions = require('./kernel/Actions');
globalThis.Models = require('./kernel/Models');

//Mysql Connection
const mysql = require('sync-mysql');
globalThis.mysqlConnection = new mysql({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.db,
});