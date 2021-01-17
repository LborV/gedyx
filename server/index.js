require('./include.js');
//Cluster mode
// const io = require('socket.io')(3030);
// const redisAdapter = require('socket.io-redis');
// let server = io.adapter(redisAdapter({host: 'localhost', port: 6379, password: '123'}));
//Single thread
const
    io = require("socket.io"),
    server = io.listen(3030);

let actionsPool = new actions({
    io: server
});

