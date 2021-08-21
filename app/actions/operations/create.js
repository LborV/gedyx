
//This file was automaticaly generated
//Feel free to edit :)

var Action = require('../../kernel/Action');

class create extends Action {
    async request(data) {
        await todos.insert(data).execute();

        let res = await todos.getAll();
        redis.set('allTodos', res);

        this.broadcast(res);
    }
}

let obj = new create('create', [validate]);
module.exports = obj;
