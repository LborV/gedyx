var model = require('./kernel/model.js');
var config = require('./configs/config.js');

var base = new model({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.db,
    table: 'test'
});



let fake = base.all();

for(let i = 1; i < 100; i++) {
    base.set(i, 'test', 2);
}

base.save().then(() => {
    console.log('DONE')
});

fake.forEach(element => {
    console.log(element.is_valid);
});