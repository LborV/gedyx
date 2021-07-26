
//This file was automaticaly generated
//Feel free to edit :)

var Action = require('../kernel/Action');

class usersOnline extends Action {
    request(data) {
        this.broadcast({users: usersOnlineCount});
    }
}

let obj = new usersOnline('usersOnline');
module.exports = obj;
