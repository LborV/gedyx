require('./include.js');
//Cluster mode
// const io = require('socket.io')(3030);
// const redisAdapter = require('socket.io-redis');
// let server = io.adapter(redisAdapter({host: 'localhost', port: 6379, password: '123'}));
//Single thread
if(config.socket && config.socket.port) {
    const
        io = require("socket.io"),
        server = io.listen(config.socket.port);

    let actionsPool = new Actions({
        io: server
    });
}

let modelsPool = new Models();

console.log(
    testTable
        .insert({
            testColumn_first: 'a', 
            testColumn_second: 'b' 
        })
        .insert({
            testColumn_first: 'a', 
            testColumn_second: 'b' 
        })
        // .getLastId()
        .delete(2)
        .set(1, 'testColumn_first', 'test')
        .update([1,2,3], {'testColumn_second': 'batman'})
        .update(5, {'testColumn_second': 'testMe'})
        // .get(1)
        .where([
            ['testColumn_second', 'batman']
        ])
);