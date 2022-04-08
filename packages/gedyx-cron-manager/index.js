const Loader = require('gedyx-loader');
const CronJob = require('gedyx-cron');
class CronManager extends Loader {
    /**
     * Loads the cron jobs from the specified directory
     * @param [dirName=cronJobs] - The name of the directory that contains the cron jobs.
     */
    constructor(dirName = 'crons', namespace = undefined) {
        super();

        this.namespace = namespace;
        if(!this.namespace) {
            this.namespace = this;
        }

        this.load(dirName);
    }

    /**
     * It loads all the files in the specified directory and then creates a CronJob object for each of them
     * @param dirName - The directory name where the cron jobs are located.
     */
    load(dirName) {
        try {
            let normalizedPath = require("path").join('', dirName);
            this.getFiles(normalizedPath).forEach((file) => {
                if(!file.includes('.js')) {
                    return;
                }

                let job = require(file);
                if(job instanceof CronJob) {
                    let jobName = file.split('/').pop().replace('.js', '');
                    this.namespace[jobName] = job;
                } else {
                    throw 'Incorrect class!';
                }
            });
        } catch(e) {
            console.error(e);
        }
    }
}

module.exports = CronManager;