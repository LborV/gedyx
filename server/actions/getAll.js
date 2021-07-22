
//This file was automaticaly generated
//Feel free to edit :)

var Action = require('../kernel/Action');

class getAll extends Action {
    request(data) {
        this.response(todos.getAll());
    }
}

let obj = new getAll('getAll');
module.exports = obj;
