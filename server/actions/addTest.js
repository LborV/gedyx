
//This file was automaticaly generated
//Feel free to edit :)

var action = require('../kernel/action.js');

class addTest extends action {
    request(data) {
        test_table.insert({
            testColumn_first: data,
            testColumn_second: (new Date()).getTime()
        });
            
        console.log(`Added new record, total: ${test_table.all().length}`);
        this.response(data);
    }
}

let obj = new addTest('addTest');
module.exports = obj;
