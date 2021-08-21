const fs = require('fs');

class Loader {
    constructor() {

    }

    getFiles(dir) {
        var result = [];
        var list = fs.readdirSync(dir);
        list.forEach(file => {
            file = dir + '/' + file;
            var stat = fs.statSync(file);
            if(stat && stat.isDirectory()) {
                result = result.concat(this.getFiles(file));
            } else {
                result.push(file);
            }
        });

        return result;
    }
}

module.exports = Loader;
