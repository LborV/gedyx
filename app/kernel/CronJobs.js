const Loader = require('./Loader');
const CronJob = require('./CronJob');
class CronJobs extends Loader {
    constructor(dirName = 'cronJobs') {
        super();
        this.load(dirName);
    }

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