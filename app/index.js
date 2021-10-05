const main = require('./main.js');

main().then(async ()=>{
    actionsPool.onConnect = (socket) => {
        console.log('Client Connected');
    }

    actionsPool.onDisconnect = (socket) => {
        console.log('Client Disconnected');
    }
});
