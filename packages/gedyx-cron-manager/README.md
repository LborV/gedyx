# gedyx-cron-manager

## Install
```
    npm i gedyx-cron-manager
```

## Usage

You should also include gedyx-cron package 
```
    npm i gedyx-cron
```

In your script

```
    const CronManager = require('gedyx-cron-manager');
    const cronJobsPool = new CronManager(dirname);
```

dirname is directory where your cron task stored(should export object of gedyx-cron). For example:
```
const CronJob = require('gedyx-cron');

class test extends CronJob {
    onTick() {
        console.log('test');
    }

    onComplete() {

    }
}

let obj = new test();
module.exports = obj;
```