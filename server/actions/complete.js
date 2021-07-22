
//This file was automaticaly generated
//Feel free to edit :)

var Action = require('../kernel/Action');

class complete extends Action {
    request(data) {
        if(data.error !== undefined) {
            return this.response({error: data.error});
        }

        todos.update({
            status: 'complete'
        })
        .where('id', data.id)
        .execute();

        this.broadcast(todos.getAll());
    }
}

let obj = new complete('complete', [validateID]);
module.exports = obj;
