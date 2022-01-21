var _cronJob = require('cron').CronJob;

class CronJob {
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

    start() {
        return this.job.start();
    }

    stop() {
        return this.job.stop();
    }

    lastDate() {
        return this.job.lastDate();
    }

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