// In this file will be automatically included your models
globalThis.config = require('./configs/config.js');
globalThis.QueryBuilder = require('./kernel/queryBuilder/QueryBuilder');
globalThis.Actions = require('./kernel/Actions');
globalThis.HttpActions = require('./kernel/HttpActions');
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
        const redis = require('redis');
        const util = require('util');
    
        for(connectionName in config.redis) {
            let connection = config.redis[connectionName];
            if(connection.port && connection.host) {
                try {
                    globalThis[connectionName] = redis.createClient(connection);
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

    // HTTP server
    if(config.http) {
        const express = require('express');
        for(httpName in config.http) {
            let http = config.http[httpName];
            http.name = httpName;

            try {
                globalThis[http.name] = express();
                if(http.static) {
                    let path = 'public';
                    if(typeof http.staticPath === 'string' && http.staticPath) {
                        path = http.staticPath;
                    }

                    globalThis[http.name].get(/(\.\w+$)/, express.static(path));
                }
            } catch(error) {
                console.error(error);
            }
        }
        
        try {
            globalThis.httpActionsPool = new HttpActions();
        } catch(error) {
            console.error(error);
        }

        // Register index route (ONLY AFTER ALL ROUTES REGISTERED)
        for(httpName in config.http) {
            let http = config.http[httpName];
            http.name = httpName;

            if(http.static) {
                globalThis[http.name].get('*', (req, res) => {
                    let path = '/public/index.html';
                    if(http.index && typeof http.index == 'string') {
                        path = http.index;
                    }
    
                    res.sendFile(__dirname + path);
                });
            }

            if(http.port) {
                globalThis[http.name].listen(http.port, () => {
                    console.log(`HTTP Server(${http.name}) started on port ${http.port}`)
                });
            }
        }
    }
}

module.exports = main;