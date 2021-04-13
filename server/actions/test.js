
//This file was automaticaly generated
//Feel free to edit :)

var Action = require('../kernel/Action');

class test extends Action {
    async request(data) {
        // this.call('test2', data);
        // this.response(data);

        let test = await testRedis.get('test');
        console.log(test);
    }
}

let obj = new test('test');
module.exports = obj;
