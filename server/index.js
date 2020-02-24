var model = require('./kernel/model.js');

//Settings for DB connection
const host = "localhost";
const user = "root";
const password = "Dbnzgblh321";

var product = new model({
    host: host,
    user: user,
    password: password,
    database: 'order_time',
    table: 'product'
});


console.log(product.getData(99));


product.delete(99);
product.save();
