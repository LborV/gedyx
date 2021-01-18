const { resolve } = require('path');
const { readdir } = require('fs').promises;
const fs = require('fs');
const Parser = require('./kernel/parserCLI');

async function* getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}

const p = new Parser();
(async () => {
    let normalizedPath = require("path").join('', "views");
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
                fs.writeFile(f.replace('.html', '.json'), JSON.stringify(res.tree[0]), (err) => {
                    if (err) return console.log(err);
                    console.log('File created: ', f);
                });
            });
        } catch(e) {
            console.error(e);
        }
    }
})();
    
