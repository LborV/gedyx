//This file was automaticaly generated
//Feel free to edit :)

var Middleware = require('../kernel/Middleware');

class testMiddleware extends Middleware {
    beforeRequest(data) {
        console.log('Data income in middleware:');
        console.log(data);

        return data = {test: 1};
    }

    afterRequest(data) {
        console.log('Data after middleware:');
        console.log(data);

        return data = {test: 2};
    }
}

let obj = new testMiddleware();
module.exports = obj;