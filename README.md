# Live Example

[Live](https://emojis.gedyx.xyz) - [Source Code](https://github.com/LborV/gedyx-exampleapp-emojis)

# Quick Start

Run in terminal (nodejs 14+)
```
    npm i gedyx gedyx-action-http gedyx-action-socket gedyx-cron gedyx-query-builder-memmory gedyx-query-builder-mysql gedyx-query-builder-redis
```

In your index.js 
```
const Gedyx = require('gedyx');
const configs = require('./configs/config');


globalThis.app = new Gedyx(configs);

globalThis.app.init();

```

Where config is object, configuration sample in [app/configs/config.js](https://github.com/LborV/gedyx/blob/main/app/configs/config.js) 