require('./include.js');

globalThis.usersOnlineCount = 0;

// Truncate Redis
redis.truncate();
// Truncate Database
todos.truncate();

actionsPool.onConnect = () => {
    console.log('Client Connected');
    usersOnlineCount++;
}

actionsPool.onDisconnect = (socket) => {
    console.log('Client Disconnected');
    usersOnlineCount--;
    actionsPool.call('usersOnline', {users: usersOnlineCount}, socket);
}

// let res = todos.where('id', '>', 2).execute();
// testMemmory.set('r', res);
// testRedis.set('r', res);

// (async () => {

//     console.log('*******************************');
//     console.time('time')
//     for(let i = 0; i < 10; i++) {
//         // res = testMemmory.get('r');
//         // console.log(res);

//         // let res = todos.where('id', '>', 2).execute();
//         // console.log(res);
        
//         let res_redis = await testRedis.get('r');
//         console.log(res_redis);
//         testRedis.delete('r');
//     }
//     console.timeEnd('time');
//     console.log('*******************************');
// })();

// let sql = todos.where('id', ';DROP``\'\\n').getSql();

// console.log(sql);

// console.log('*******************************');


// let insertTest = 'test';

// testRedis.set('test1', insertTest);
// testRedis.get('test1').then(data => {
//     console.log(data);
// });
// testRedis.truncate();
// testRedis.get('test1').then(data => {
//     console.log(data);
// });

// testRedis.set('test1', insertTest);
// testRedis.get('test1').then(data => {
//     console.log(data);
// });

// testRedis.set('test1', insertTest);
// testRedis.get('test1').then(data => {
//     console.log(data);
// });
