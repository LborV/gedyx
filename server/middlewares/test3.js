
//This file was automaticaly generated
//Feel free to edit :)

var Middleware = require('../kernel/Middleware');

class test3 extends Middleware {
    beforeRequest(data) {
        console.log('Hi From test3');
        return data;
    }

    afterRequest(data) {
        return data;
    }
}

let obj = new test3();
module.exports = obj;
