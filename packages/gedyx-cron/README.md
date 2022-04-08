# gedyx-cron

## Install
```
    npm i gedyx-cron
```

## Usage

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

### Arguments
```
/**
    * Creates a new cron job
    * @param [cronTime=* * * * * *] - The cron time string.
    * @param [start=true] - If true, the cron job will start immediately. If false, the cron job will
    * not start until the start() method is called.
    * @param [timeZone=null] - The time zone to use for the cron job.
    * @param [runOnInit=false] - If true, the job will run immediately after it's created.
    * @param [unrefTimeout=false] - If set to true, the cron job will be unrefed after it's first tick.
*/
```

### Methods
```
    /**
     * Start the job
     * @returns The return value is the result of calling the start() method on the job.
     */
    start()

    /**
     * Stop the job
     * @returns The return value is a promise that resolves to the job instance.
     */
    stop()

    /**
     * Returns the last date of the job
     * @returns The last date of the job.
     */
    lastDate()


    /**
     * Returns the next dates of the job
     * @returns The nextDates() method returns an array of dates.
     */
    nextDates()

    
    /**
     * Should be redefined
     */
    onTick()

    /**
     * Should be redefined
     */
    onComplete()
```