
//This file was automaticaly generated
//Feel free to edit :)

var Action = require('../kernel/Action');

class create extends Action {
    request(data) {
        todos.insert(data).execute();

        let res = todos.getAll();
        redis.set('allTodos', res);

        this.broadcast(res);
    }
}

let obj = new create('create', [validate]);
module.exports = obj;
