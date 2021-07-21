
//This file was automaticaly generated
//Feel free to edit :)

var Middleware = require('../kernel/Middleware');

class test2 extends Middleware {
    beforeRequest(data) {
        return data;
    }

    afterRequest(data) {
        console.log('Hi From test2');
        return data;
    }
}

let obj = new test2();
module.exports = obj;
