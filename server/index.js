require('./include.js');

globalThis.usersOnlineCount = 0;

actionsPool.onConnect = () => {
    usersOnlineCount++;
}

actionsPool.onDisconnect = (socket) => {
    usersOnlineCount--;
    actionsPool.call('usersOnline', {users: usersOnlineCount}, socket);
}

let res = todos.where('id', '>', 2).execute();
testMemmory.set('r', res);

(async () => {

    console.log('*******************************');
    console.time('time')
    for(let i = 0; i < 10; i++) {
        res = testMemmory.get('r');
        console.log(res);

        // let res = todos.where('id', '>', 2).execute();
        // console.log(res);
        
        // let res_redis = await testRedis.get('r');
        // console.log(res_redis);
    }
    console.timeEnd('time');
})();

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


