
//This file was automaticaly generated
//Feel free to edit :)

var Middleware = require('../kernel/Middleware');

class validate extends Middleware {
    beforeRequest(data) {
        // SOME DATA VALIDATIONS
        console.log('TEST ME');

        return data;
    }

    afterRequest(data) {
        return data;
    }
}

let obj = new validate();
module.exports = obj;
