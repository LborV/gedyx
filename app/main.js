// In this file will be automatically included your models
globalThis.config = require('./configs/config.js');
globalThis.Actions = require('gedyx-action-manager');
globalThis.Models = require('gedyx-models');
globalThis.CronManager = require('gedyx-cron-manager');

async function main() {
    // Mysql Connection
    if(config.mysql) {
        const mysql = require('mysql2/promise');

        for(connectionName in config.mysql) {
            let connection = config.mysql[connectionName];
            if(connection.host && connection.user && connection.user && connection.password && connection.db) {
                try {
                    globalThis[connectionName] = await mysql.createPool({
                        host: connection.host,
                        user: connection.user,
                        password: connection.password,
                        database: connection.db,
                        waitForConnections: connection.waitForConnections ?? true,
                        connectionLimit: connection.connectionLimit ?? 1,
                        queueLimit: connection.queueLimit ?? 0
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
                } catch(error) {
                    console.error(error);
                }
            }
        }
    }

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
            let ioSettings = {};

            if(config.socket && config.socket.port) {
                const { Server } = require("socket.io");
                const io = new Server(config.socket.server ?? {});
                io.listen(config.socket.port);

                console.log(`Sockets listening on port: ${config.socket.port}`);
                ioSettings = {
                    io: io,
                    useSession: config.socket?.useSession,
                    session: config.socket?.session
                };
            }

            globalThis.actionsPool = new Actions(ioSettings, 'actions', globalThis);
            await globalThis.actionsPool.init();
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

    // Register Models
    globalThis.modelsPool = new Models('models', globalThis);

    // Register Cron tasks
    if(config.cron) {
        globalThis.cronJobsPool = new CronManager();
    }
}

module.exports = main;