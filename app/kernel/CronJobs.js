const Loader = require('./Loader');
const CronJob = require('./CronJob');
class CronJobs extends Loader {
    /**
     * Loads the cron jobs from the specified directory
     * @param [dirName=cronJobs] - The name of the directory that contains the cron jobs.
     */
    constructor(dirName = 'cronJobs') {
        super();
        this.load(dirName);
    }

    /**
     * It loads all the files in the specified directory and then creates a CronJob object for each of them
     * @param dirName - The directory name where the cron jobs are located.
     */
    load(dirName) {
        try{
            globalThis['_cronJobs'] = {};
            let normalizedPath = require("path").join('', dirName);
            this.getFiles(normalizedPath).forEach((file) => {
                if(!file.includes('.js')) {
                    return;
                }

                let job = require(`../${file}`);
                if(job instanceof CronJob) {
                    let jobName = file.split('/').pop().replace('.js', '');
                    globalThis['_cronJobs'][jobName] = job;
                } else {
                    throw 'Incorrect class!';
                }
            });
        } catch(e) {
            console.error(e);
        }
    }
}

module.exports = CronJobs;