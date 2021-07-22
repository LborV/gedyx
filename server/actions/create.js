
//This file was automaticaly generated
//Feel free to edit :)

var Action = require('../kernel/Action');

class create extends Action {
    request(data) {
        todos.insert(data).execute();

        this.broadcast(todos.getAll());
    }
}

let obj = new create('create', [validate]);
module.exports = obj;
