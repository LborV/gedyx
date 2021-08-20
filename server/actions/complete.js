
//This file was automaticaly generated
//Feel free to edit :)

var Action = require('../kernel/Action');

class complete extends Action {
    async request(data) {
        if(data.error !== undefined) {
            return this.response({error: data.error});
        }

        await todos.update({
            status: 'complete'
        })
        .where('id', data.id)
        .execute();

        let res = await todos.getAll();
        redis.set('allTodos', res);

        this.broadcast(res);
    }
}

let obj = new complete('complete', [validateID]);
module.exports = obj;
