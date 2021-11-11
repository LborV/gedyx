const fs = require("fs");

function main(arg) {
    if(arg.length <= 2) {
        return 'To few arguments';
    }

    try {
        if(!checkDir()) {
            return './cronJobs directory can\'t be found';
        }
    
        arg.splice(0, 2);
    
        arg.forEach(cronName => {
            fs.open('./cronJobs/' + cronName + '.js', 'wx+', (err, file) => {
                if(err) {
                    console.log('Something wrong with ./cronJobs/' + cronName + '.js file, check it out');
                    return;
                }
    
                // let cron_name = cronName.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g).map(x => x.toLowerCase()).join('_');
                let cron_name = cronName;
                let buf = Buffer.from(makeFileContent(cronName, cron_name));
                let len = buf.length;
    
                fs.write(file, buf, 0, len, 0, (err) => {
                    if(err) {
                        console.log('Can\'t write content to file ./cronJobs/' + cronName + '.js');
                        return;
                    }
    
                    console.log('File ./cronJobs/' + cronName + '.js created!');
                });
            });
        });
    } catch (e) {
        console.error(e);
    }
    
}

function makeFileContent(cronName, cron_name) {
    return `
//This file was automaticaly generated
//Feel free to edit :)

var CronJob = require('../kernel/CronJob');

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

function checkDir(path = './cronJobs') {
   return fs.existsSync(path);
}

main(process.argv);