
//This file was automaticaly generated
//Feel free to edit :)

var Model = require('../kernel/model/Model');

//Include interfaces manualy
const RedisInterface = require('../kernel/interfaces/RedisInterface');
//Mysql interface configuration 
const redisInterface = new RedisInterface({
    connection: redisConnection,
    table: 'testRedis'
});

class testRedis extends Model {

}

let obj = new testRedis (redisInterface);
module.exports = obj;
