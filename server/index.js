require('./include.js');

globalThis.usersOnlineCount = 0;

actionsPool.onConnect = () => {
    usersOnlineCount++;
}

actionsPool.onDisconnect = (socket) => {
    usersOnlineCount--;
    actionsPool.call('usersOnline', {users: usersOnlineCount}, socket);
}

testRedis.set('test1', 'test me string');
testRedis.get('test1').then(data => {
    console.log(data);
});
testRedis.truncate();
testRedis.get('test1').then(data => {
    console.log(data);
});

testRedis.set('test1', 'test me string2');
testRedis.get('test1').then(data => {
    console.log(data);
});

testRedis.set('test1', 'test me string3');
testRedis.get('test1').then(data => {
    console.log(data);
});
