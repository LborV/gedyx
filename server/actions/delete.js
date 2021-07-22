
//This file was automaticaly generated
//Feel free to edit :)

var Action = require('../kernel/Action');

class deleteAction extends Action {
    request(data) {
        if(data.error !== undefined) {
            return this.response({error: data.error});
        }

        todos
            .update({
                status: 'deleted'
            })
            .where('id', data.id)
            .execute();

        this.broadcast(todos.getAll());
    }
}

let obj = new deleteAction('delete', [validateID]);
module.exports = obj;
