
//This file was automaticaly generated
//Feel free to edit :)

var Action = require('../kernel/Action');

class test extends Action {
    request(data) {
        this.call('test2', ['test']);
        this.response(data);
    }
}

let obj = new test('test');
module.exports = obj;
