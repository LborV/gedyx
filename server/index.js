require('./include.js');

queryBuilder = require('./kernel/queryBuilder/MysqlQueryBuilder');
let builder = new queryBuilder(mysqlConnection);

console.info(
    builder
        .table('testTable')
        .select(
            'a',
            ['b','c','d']
        )
        .whereNull('a')
        .whereNotNull('b')
        .where('a', `'v'`)
        .limit(5)
        .orderBy('a')
        .orderByDesc('b')
        .getSql()
);


// console.info(
//     builder
//         .table('testTable')
//         .update({
//             'a': 'a',
//             'b': 2
//         })
//         .where('a', 'true')
//         .getSql()
// );


// console.info(
//     builder
//         .table('testTable')
//         .insert({
//             'a': 'test',
//             'b': 2
//         })
//         .getSql()
// );