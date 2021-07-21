
//This file was automaticaly generated
//Feel free to edit :)

var Middleware = require('../kernel/Middleware');

class test1 extends Middleware {
    beforeRequest(data) {
        return data;
    }

    afterRequest(data) {
        console.log('Hi From test1');
        return data;
    }
}

let obj = new test1();
module.exports = obj;
