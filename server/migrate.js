const fs = require('fs')
const exec = require('child_process').exec
const async = require('async')
var model = require('./kernel/migration.js');
var config = require('./configs/config.js');

let migration_table = new model({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.db
}, true);


if(!(migration_table.getAllTables().includes('migrations'))) {
  migration_table.migrate([
    {table: 'migrations', drop: false, name: 'file_name', type: 'text'},
    {table: 'migrations', drop: false, name: 'timestamp', type: 'int'},
  ]);
}

migration_table = new model({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.db,
  table: 'migrations'
});

const scriptsFolder = './migrations/' 
const files = fs.readdirSync(scriptsFolder)

files.map(function(file) {
  if(migration_table.where(['file_name', file]).length) {
    return;
  }

  migration_table.insert({
    file_name: file,
    timestamp: Math.floor(Date.now() / 1000)
  }).save();

  return exec(`node ${scriptsFolder}${file}`);
})