// In this file will be aotomaticaly included your models
globalThis.config = require('./configs/config.js');
globalThis.QueryBuilder = require('./kernel/queryBuilder/QueryBuilder');
globalThis.Actions = require('./kernel/Actions');
globalThis.Models = require('./kernel/Models');

// Mysql Connection
if(config.mysql && config.mysql.host && config.mysql.user && config.mysql.user && config.mysql.password && config.mysql.db) {
    try {
        const mysql = require('sync-mysql');
        globalThis.mysqlConnection = new mysql({
            host: config.mysql.host,
            user: config.mysql.user,
            password: config.mysql.password,
            database: config.mysql.db,
        });
    } catch(error) {
        console.error(error);
    }
}

// Redis connection
if(config.redis && config.redis.port && config.redis.host && config.redis.password) {
    try {
        globalThis.redis = require('redis');
        const util = require('util');
        globalThis.redisConnection = redis.createClient();
        globalThis.redisConnection.get = util.promisify(globalThis.redisConnection.get);
    } catch (error) {
        console.error(error);
    }
}

// Cluster mode
// const io = require('socket.io')(3030);
// const redisAdapter = require('socket.io-redis');
// let server = io.adapter(redisAdapter({host: 'localhost', port: 6379, password: '123'}));

// Single thread
if(config.socket && config.socket.port) {
    try {
        const
            io = require("socket.io"),
            server = io.listen(config.socket.port);

        globalThis.actionsPool = new Actions({
            io: server
        });
    } catch (error) {
        console.error(error);
    }
}

globalThis.modelsPool = new Models();