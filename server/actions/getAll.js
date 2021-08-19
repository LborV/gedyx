
//This file was automaticaly generated
//Feel free to edit :)

var Action = require('../kernel/Action');

class getAll extends Action {
    request(data) {
        redis.get('allTodos').then((res) => {
            if(res.length == 0) {
                res = todos.getAll();

                redis.set('allTodos', res);
            }
    
            this.response(res);
        });
    }
}

let obj = new getAll('getAll');
module.exports = obj;
