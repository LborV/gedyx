/* Get all the files in a directory and its subdirectories */
const fs = require('fs');
const { dirname } = require('path');
const path = require('path');

class Loader {
    constructor() {

    }

    /**
     * Get all the files in a directory and its subdirectories
     * @param dir - The directory to search in.
     * @returns An array of files.
     */
    getFiles(dir) {
        var result = [];
        var list = fs.readdirSync(path.join(dirname(require.main.filename), dir));

        list.forEach(file => {
            file = path.join(dirname(require.main.filename), dir, file);
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
