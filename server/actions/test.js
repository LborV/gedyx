var action = require('../kernel/action.js');

class test extends action {
    
}

let obj = new test ({
    actionName: 'test'
});

module.exports = obj;