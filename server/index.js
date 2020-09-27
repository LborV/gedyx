require('./include.js');
const
    io = require("socket.io"),
    server = io.listen(3000);

let actionsPool = new actions({
    io: server,
    actionList: config.actionList
});
