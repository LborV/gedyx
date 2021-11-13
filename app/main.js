// In this file will be aotomaticaly included your models
globalThis.config = require('./configs/config.js');
globalThis.QueryBuilder = require('./kernel/queryBuilder/QueryBuilder');
globalThis.Actions = require('./kernel/Actions');
globalThis.Models = require('./kernel/Models');
globalThis.CronJobs = require('./kernel/CronJobs');

async function main() {
    // Mysql Connection
    if(config.mysql) {
        globalThis.SqlString = require('sqlstring');
        const mysql = require('mysql2/promise');

        for(connectionName in config.mysql) {
            let connection = config.mysql[connectionName];
            if(connection.host && connection.user && connection.user && connection.password && connection.db) {
                try {
                    globalThis[connectionName] = await mysql.createConnection({
                        host: connection.host,
                        user: connection.user,
                        password: connection.password,
                        database: connection.db,
                    });
                } catch(error) {
                    console.error(error);
                }
            }
        }
    }

    // Redis connection
    if(config.redis) {
        globalThis.Redis = require('redis');
        const util = require('util');
    
        for(connectionName in config.mysql) {
            let connection = config.mysql[connectionName];
            if(connection.port && connection.host) {
                try {
                    globalThis[connectionName] = Redis.createClient(config.redis);
                    globalThis[connectionName].get = util.promisify(globalThis[connectionName].get);
                } catch (error) {
                    console.error(error);
                }
            }
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