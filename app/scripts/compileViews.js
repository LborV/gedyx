const { resolve } = require('path');
const { readdir } = require('fs').promises;
const fs = require('fs');
const Parser = require('../public/kernel/parserCLI');
const getDirName = require('path').dirname;

async function* getFiles(dir) {
	const dirents = await readdir(dir, { withFileTypes: true });
	for(const dirent of dirents) {
		const res = resolve(dir, dirent.name);
		if(dirent.isDirectory()) {
			yield* getFiles(res);
		} else {
			yield res;
		}
	}
}

function writeFile(path, contents, cb) {
    fs.mkdir(getDirName(path), { recursive: true}, function (err) {
        if(err) {
            return cb(err);
        }
  
        fs.writeFile(path, contents, cb);
    });
}

const p = new Parser();
(async () => {
    let normalizedPath = require("path").join('', "public/views");
    for await (const f of getFiles(normalizedPath)) {
        try {
            fs.readFile(f, (error, data) => {
                if(error) {
                    throw error;
                }

                if(!f.includes('.html')) {
                    return;
                }

                let res = p.makeTreeFromString(data.toString());
                writeFile(
                    f.replace('.html', '.json').replace('/views', '/views_compiled'), 
                    JSON.stringify(res.tree[0]), 
                    (err) => {
                        if(err) {
                            return console.error(err);
                        }

                        console.log('File created: ', f.replace('.html', '.json').replace('/views', '/views_compiled'));
                    }
                );
            });
        } catch(e) {
            console.error(e);
        }
    }
})();