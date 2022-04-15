const Actions = require('gedyx-action-manager');
const Models = require('gedyx-models');
const CronManager = require('gedyx-cron-manager');

class Gedyx {
    constructor(configs = {}, namespace = undefined) {
        this.configs = configs;

        this.modelsDir = 'models';
        this.actionsDir = 'actions';
        this.cronsDir = 'crons';

        if(this.configs.models) {
            this.modelsDir = this.configs.models;
        }

        if(this.configs.crons) {
            this.cronsDir = this.configs.crons;
        }

        if(this.configs.actions) {
            this.actionsDir = this.configs.actions;
        }

        this.namespace = namespace;
        if(this.namespace === undefined) {
            this.namespace = this;
        }

    }

    async init() {
        if(this.configs.mysql) {
            try {
                await this.initMysql(this.configs);
            } catch(err) {
                this.error(err);
            }
        }

        if(this.configs.redis) {
            try {
                await this.initRedis(this.configs);
            } catch(err) {
                this.error(err);
            }
        }

        if(this.configs.http) {
            try {
                await this.initHttpApi(this.configs);
            } catch(err) {
                this.error(err);
            }
        }

        try {
            await this.initActions(this.configs);
        } catch(err) {
            this.error(err);
        }

        if(this.configs.http) {
            try {
                await this.initHttpStatic(this.configs);
            } catch(err) {
                this.error(err);
            }
        }

        try {
            await this.initModels();
        } catch(err) {
            this.error(err);
        }

        if(this.configs.cron) {
            try {
                await this.initCron(this.configs);
            } catch(err) {
                this.error(err);
            }
        }
    }

    async initModels() {
        new Models(this.modelsDir, this.namespace);
    }

    async initCron() {
        this.namespace.crons = {};
        new CronManager(this.cronsDir, this.namespace.crons);
    }

    async initHttpStatic(config) {
        for(let httpName in config.http) {
            let http = config.http[httpName];
            http.name = httpName;

            if(http.static) {
                this.namespace[http.name].get('*', (req, res) => {
                    let path = '/public/index.html';
                    if(http.index && typeof http.index == 'string') {
                        path = http.index;
                    }

                    res.sendFile(__dirname + path);
                });
            }

            if(http.port) {
                this.namespace[http.name].listen(http.port, () => {
                    console.log(`HTTP Server(${http.name}) started on port ${http.port}`)
                });
            }
        }
    }

    async initActions(config) {
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

        this.namespace.actions = {};
        this.namespace.actionsPool = new Actions(ioSettings, this.actionsDir, this.namespace.actions);
        await this.namespace.actionsPool.init();

    }

    async initHttpApi(config) {
        const express = require('express');
        for(let httpName in config.http) {
            let http = config.http[httpName];
            http.name = httpName;

            try {
                this.namespace[http.name] = express();
                if(http.static) {
                    let path = 'public';
                    if(typeof http.staticPath === 'string' && http.staticPath) {
                        path = http.staticPath;
                    }

                    this.namespace[http.name].get(/(\.\w+$)/, express.static(path));
                }
            } catch(error) {
                console.error(error);
            }
        }
    }

    async initRedis(config) {
        const redis = require('redis');
        const util = require('util');

        for(let connectionName in config.redis) {
            let connection = config.redis[connectionName];
            if(connection.port && connection.host) {
                this.namespace[connectionName] = redis.createClient(connection);
                this.namespace[connectionName].get = util.promisify(this.namespace[connectionName].get);
            }
        }
    }

    async initMysql(config) {
        const mysql = require('mysql2/promise');

        for(let connectionName in config.mysql) {
            let connection = config.mysql[connectionName];
            if(connection.host && connection.user && connection.user && connection.password && connection.db) {
                this.namespace[connectionName] = await mysql.createPool({
                    host: connection.host,
                    user: connection.user,
                    password: connection.password,
                    database: connection.db,
                    waitForConnections: connection.waitForConnections ?? true,
                    connectionLimit: connection.connectionLimit ?? 1,
                    queueLimit: connection.queueLimit ?? 0
                });
            }
        }
    }

    error(err) {
        console.error(err);
    }
}

module.exports = Gedyx;