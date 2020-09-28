var action = require('../kernel/action.js');

class test extends action {
    request(data) {
        console.log(data);

        this.response({myMessage: "TEEEEST"});
    }
}

let obj = new test('test');

module.exports = obj;