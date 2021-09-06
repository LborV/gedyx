
//This file was automaticaly generated
//Feel free to edit :)

var Action = require('../../kernel/Action');

class getAll extends Action {
    async request(data) {
        let res = await redis.get('allTodos');

        if(this.socket.session.test == undefined) {
            this.socket.session.test = 0;
        } else {
            this.socket.session.test += 1;
        }

        // this.parent.sessions.forget(this.socket.session.sessionKey);

        console.log(this.socket.session.test);

        if(!res.length) {
            res = await todos.getAll();
            redis.set('allTodos', res);
        }
    
        this.response(res);
    }
}

let obj = new getAll('getAll', [validate]);
module.exports = obj;
