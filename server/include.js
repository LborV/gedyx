//In this file will be aotomaticaly included your models
globalThis.config = require('./configs/config.js');
globalThis.ModelInterface = require('./kernel/interfaces/ModelInterface');
globalThis.Actions = require('./kernel/Actions');
globalThis.Models = require('./kernel/Models');

//Mysql Connection
if(config.mysql && config.mysql.host && config.mysql.user && config.mysql.user && config.mysql.password && config.mysql.db) {
    const mysql = require('sync-mysql');
    globalThis.mysqlConnection = new mysql({
        host: config.mysql.host,
        user: config.mysql.user,
        password: config.mysql.password,
        database: config.mysql.db,
    });
}