
    var model = require('../kernel/model.js');
    var config = require('../configs/configs.js');

    class Users extends model {

    }

    let obj = new Users({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.db,
        table: 'users',
    });

    module.exports = obj;
    