const main = require('./main.js');

main().then(()=>{
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
});
