// In this file will be aotomaticaly included your models
globalThis.config = require('./configs/config.js');
globalThis.QueryBuilder = require('./kernel/queryBuilder/QueryBuilder');
globalThis.Actions = require('./kernel/Actions');
globalThis.Models = require('./kernel/Models');
globalThis.CronJobs = require('./kernel/CronJobs');

async function main() {
    // Mysql Connection
    if(config.mysql && config.mysql.host && config.mysql.user && config.mysql.user && config.mysql.password && config.mysql.db) {
        try {
            globalThis.SqlString = require('sqlstring');
            const mysql = require('mysql2/promise');
            globalThis.mysqlConnection = await mysql.createConnection({
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
    if(config.redis && config.redis.port && config.redis.host) {
        try {
            globalThis.Redis = require('redis');
            const util = require('util');
            globalThis.redisConnection = Redis.createClient(config.redis);
            globalThis.redisConnection.get = util.promisify(globalThis.redisConnection.get);
        } catch (error) {
            console.error(error);
        }
    }

    // Single thread
    if(config.socket && config.socket.port) {
        try {
            const { Server } = require("socket.io");
            const io = new Server(config.socket.server ?? {});
            io.listen(config.socket.port);

            globalThis.actionsPool = new Actions({
                io: io,
                useSession: config.socket?.useSession,
                session: config.socket?.session
            });
        } catch (error) {
            console.error(error);
        }
    }

    // Register Models
    globalThis.modelsPool = new Models();

    // Register Cron tasks
    globalThis.cronJobsPool = new CronJobs();
}

module.exports = main;