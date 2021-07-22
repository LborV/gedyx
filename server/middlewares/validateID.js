
//This file was automaticaly generated
//Feel free to edit :)

var Middleware = require('../kernel/Middleware');

class validateID extends Middleware {
    beforeRequest(data) {
        if(data.id === undefined) {
            data.error = 'Not Specified Error';
        }

        return data;
    }

    afterRequest(data) {
        return data;
    }
}

let obj = new validateID();
module.exports = obj;
