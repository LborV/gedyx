var model = require('./kernel/model.js');

var product = new model({
    host: host,
    user: user,
    password: password,
    database: 'order_time',
    table: 'adress',
});



console.log(product.where([
    ['id', '>', 100],
]));

// product.save();