const fs = require("fs");

function main(arg) {
    if(arg.length <= 2) {
        return 'To few arguments';
    }

    try {
        if(!checkDir()) {
            return './public/js/controllers directory can\'t be found';
        }
    
        arg.splice(0, 2);
    
        arg.forEach(controllerName => {
            fs.open('./public/js/controllers/' + controllerName + '.js', 'wx+', (err, file) => {
                if(err) {
                    console.log('Something wrong with ./public/js/controllers/' + controllerName + '.js file, check it out');
                    return;
                }
    
                let buf = Buffer.from(makeFileContent(controllerName));
                let len = buf.length;
    
                fs.write(file, buf, 0, len, 0, (err) => {
                    if(err) {
                        console.log('Can\'t write content to file ./public/js/controllers/' + controllerName + '.js');
                        return;
                    }
    
                    console.log('File ./public/js/controllers/' + controllerName + '.js created!');
                });
            });
        });
    } catch (e) {
        console.error(e);
    }
    
}

function makeFileContent(controllerName) {
    return `
import {Controller} from '/kernel/Controller.min.js';

export default class ${controllerName} extends Controller{
    constructor(settings) {
        super(settings);
    }

    onShow() {
        console.log('Showed: '+this.name);
    }

    onLoad() {
        console.log('Loaded: '+this.name);
    }

    onUpdate() {
        console.log('Updated: '+this.name)
    }
};
    
`;
}

function checkDir(path = './public/js/controllers') {
   return fs.existsSync(path);
}

main(process.argv);