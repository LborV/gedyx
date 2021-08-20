var assert = require('assert');
global.ModelInterface = require('../kernel/interfaces/ModelInterface');
const MysqlInterface = require('../kernel/interfaces/MysqlInterface');
const Model = require('../kernel/model/Model');
const mysql = require('sync-mysql');

describe('Model and migrations with db', function () {
    var config = {
        host: "localhost",
        user: "user",
        password: "pass",
        db: 'testDatabase'
    };

    const mysqlConnection = new mysql({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.db,
    });

   
});