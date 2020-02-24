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
    table: 'adress',
});


for(let i = 0; i < 100; i++) {
    product.insert({
        sernr: 'lol',
        company: 'test',
        deladdress: 'this',
        is_default: i
    });
}

console.log(product.getData());

// product.save();