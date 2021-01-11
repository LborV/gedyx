
//This file was automaticaly generated
//Feel free to edit :)

var action = require('../kernel/action.js');

class getTest extends action {
    request(data) {
        this.response(test_table.all());
    }
}

let obj = new getTest('getTest');
module.exports = obj;
