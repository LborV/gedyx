const main = require('./main.js');

main().then(async ()=>{
    globalThis.usersOnlineCount = 0;
    // Truncate Redis
    // redis.truncate();
    
    // Truncate Database
    todos.truncate();


    for(let i = 0; i < 10; i++) {
        await todos.insert({
            text: 'test',
            status: i % 3 ? 'complete' : (i % 2 ? 'active' : 'deleted')
        }).execute();
    }

    console.log(
        await todos.execute()
    )

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
