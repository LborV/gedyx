require('./include.js');

globalThis.usersOnlineCount = 0;

actionsPool.onConnect = () => {
    usersOnlineCount++;
}

actionsPool.onDisconnect = (socket) => {
    usersOnlineCount--;
    actionsPool.call('usersOnline', {users: usersOnlineCount}, socket);
}

console.log('*******************************');


let sql = todos.where('id', ';DROP``\'\\n').getSql();

console.log(sql);

console.log('*******************************');


let insertTest = 'test';

testRedis.set('test1', insertTest);
testRedis.get('test1').then(data => {
    console.log(data);
});
testRedis.truncate();
testRedis.get('test1').then(data => {
    console.log(data);
});

testRedis.set('test1', insertTest);
testRedis.get('test1').then(data => {
    console.log(data);
});

testRedis.set('test1', insertTest);
testRedis.get('test1').then(data => {
    console.log(data);
});


