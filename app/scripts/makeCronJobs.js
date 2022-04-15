const fs = require("fs");

function main(arg) {
    if(arg.length <= 2) {
        return 'To few arguments';
    }

    try {
        if(!checkDir()) {
            return './crons directory can\'t be found';
        }

        arg.splice(0, 2);

        arg.forEach(cronName => {
            fs.open('./crons/' + cronName + '.js', 'wx+', (err, file) => {
                if(err) {
                    console.log('Something wrong with ./crons/' + cronName + '.js file, check it out');
                    return;
                }

                // let cron_name = cronName.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g).map(x => x.toLowerCase()).join('_');
                let cron_name = cronName;
                let buf = Buffer.from(makeFileContent(cronName, cron_name));
                let len = buf.length;

                fs.write(file, buf, 0, len, 0, (err) => {
                    if(err) {
                        console.log('Can\'t write content to file ./crons/' + cronName + '.js');
                        return;
                    }

                    console.log('File ./crons/' + cronName + '.js created!');
                });
            });
        });
    } catch(e) {
        console.error(e);
    }

}

function makeFileContent(cronName, cron_name) {
    return `
const CronJob = require('gedyx-cron');

class ${cron_name} extends CronJob {
    onTick() {
        
    }

    onComplete() {

    }
}

let obj = new ${cron_name}();
module.exports = obj;
    
`;
}

function checkDir(path = './crons') {
    return fs.existsSync(path);
}

main(process.argv);