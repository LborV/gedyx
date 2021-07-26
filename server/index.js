require('./include.js');

globalThis.usersOnlineCount = 0;

actionsPool.onConnect = () => {
    usersOnlineCount++;
}

actionsPool.onDisconnect = (socket) => {
    usersOnlineCount--;
    actionsPool.call('usersOnline', {users: usersOnlineCount}, socket);
}