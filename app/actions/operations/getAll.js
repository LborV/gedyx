
//This file was automaticaly generated
//Feel free to edit :)

var Action = require('../../kernel/Action');

class getAll extends Action {
    async request(data) {
        let res = await redis.get('allTodos');

        if(!res.length) {
            res = await todos.getAll();
            redis.set('allTodos', res);
        }
    
        this.response(res);
    }
}

let obj = new getAll('getAll', [validate]);
module.exports = obj;
