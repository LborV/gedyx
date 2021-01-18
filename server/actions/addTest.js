
//This file was automaticaly generated
//Feel free to edit :)

var Action = require('../kernel/Action');

class addTest extends Action {
    request(data) {
        this.response(testTable.insert(data).all());
    }
}

let obj = new addTest('addTest');
module.exports = obj;
