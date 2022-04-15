const Gedyx = require('gedyx');
const configs = require('./configs/config');


globalThis.app = new Gedyx(configs);

globalThis.app.init();
