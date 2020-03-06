var model = require('./kernel/model.js');
var config = require('./configs/config.js');

var product = new model({
    host: config.host,
    user: config.user,
    password: config.password,
    database: 'order_time',
    table: 'adress',
});



console.log(product.where([
    ['id', '>', 100],
]));

// product.save();