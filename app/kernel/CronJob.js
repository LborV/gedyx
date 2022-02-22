var _cronJob = require('cron').CronJob;

class CronJob {
   /**
    * Creates a new cron job
    * @param [cronTime=* * * * * *] - The cron time string.
    * @param [start=true] - If true, the cron job will start immediately. If false, the cron job will
    * not start until the start() method is called.
    * @param [timeZone=null] - The time zone to use for the cron job.
    * @param [runOnInit=false] - If true, the job will run immediately after it's created.
    * @param [unrefTimeout=false] - If set to true, the cron job will be unrefed after it's first tick.
    */
    constructor(
        cronTime = '* * * * * *',
        start = true,
        timeZone = null,
        runOnInit = false,
        unrefTimeout = false
    ) {
        try {
            this.job = new _cronJob(
                cronTime, 
                this.onTick, 
                this.onComplete, 
                start, 
                timeZone, 
                this, 
                runOnInit, 
                undefined, 
                unrefTimeout
            );

        } catch(error) {
            console.error(error);
        }
    }

    /**
     * Start the job
     * @returns The return value is the result of calling the start() method on the job.
     */
    start() {
        return this.job.start();
    }

    /**
     * Stop the job
     * @returns The return value is a promise that resolves to the job instance.
     */
    stop() {
        return this.job.stop();
    }

    /**
     * Returns the last date of the job
     * @returns The last date of the job.
     */
    lastDate() {
        return this.job.lastDate();
    }

    /**
        * Returns the next dates of the job
        * @returns The nextDates() method returns an array of dates.
        */
    nextDates() {
        return this.job.nextDates();
    }

    getJob() {
        return this.job;
    }

    onTick() {

    }

    onComplete() {

    }
}

module.exports = CronJob;