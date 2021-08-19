
//This file was automaticaly generated
//Feel free to edit :)

var Action = require('../kernel/Action');

class getAll extends Action {
    async request(data) {
        let res = await redis.get('allTodos');

        console.log('FROM REDIS:', res);
        if(!res.length) {
            res = todos.getAll();
            console.log('FROM DATABSE:', res);
            redis.set('allTodos', res);
        }
    
        this.response(res);
    }
}

let obj = new getAll('getAll');
module.exports = obj;
