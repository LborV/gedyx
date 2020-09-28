var action = require('../kernel/action.js');

class test2 extends action {
    request(data) {
        console.log(data)
    }
}

let obj = new test2('test2');

module.exports = obj;