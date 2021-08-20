
//This file was automaticaly generated
//Feel free to edit :)

var Action = require('../kernel/Action');

class usersOnline extends Action {
    async request(data) {
        this.broadcast({users: usersOnlineCount});
    }
}

let obj = new usersOnline('usersOnline');
module.exports = obj;
