require('./include.js');


console.info(
    testTable
        .selectRaw('*')
        .get()
);