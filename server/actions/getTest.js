
//This file was automaticaly generated
//Feel free to edit :)

var Action = require('../kernel/Action');

class getTest extends Action {
    request(data) {
        this.response(testTable.all());
    }
}

let obj = new getTest('getTest');
module.exports = obj;
