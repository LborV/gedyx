//This file was automaticaly generated
//Feel free to edit :)

const MysqlQueryBuilder = require('../kernel/queryBuilder/MysqlQueryBuilder');    
class testTable extends MysqlQueryBuilder {
    test() {
        this.insert({
            testColumn_first: 'testMe',
            testColumn_second: 'Random String'
        }).execute();

        // let last = this.getLast();
        // console.info(last);
        // this
        //     .delete()
        //     .where('id', last[0].id)
        //     .execute();
        // last = this.getLast();
        // console.info(last);

        // return this
        //     .select('id')
        //     .limit(1)
        //     .orderByDesc('id')
        //     .execute();

        // return this
        //     .select(
        //         'testColumn_first',
        //         'testColumn_second',
        //         'id'
        //     )
        //     .orWhere('id', '>', 150)
        //     .where((query) => {
        //         return query
        //             .where('id', 120)
        //             .orWhere('id', 130);
        //     })
        //     .limit(10)
        //     .getSql();
    
        // return this
        //     .select('id')
        //     .union((query) => {
        //         return query
        //             .table('testTable')
        //             .select('id')
        //             .where('id', 10);
        //     })
        //     .where('id', '<', 11)
        //     .execute();
    
        // return this
        //     .select('id')
        //     .unionAll((query) => {
        //         return query
        //             .table('testTable')
        //             .select('id')
        //             .where('id', 10);
        //     })
        //     .where('id', '<', 11)
        //     .execute();

        // return this
        //     .select('id', 'testColumn_first')
        //     .groupBy('id')
        //     .execute();

        // return this
        //     .select('id')
        //     .leftJoin('a', (query) => {
        //         return query
        //             .where('a.a', this.tableName+'.id')
        //             .where((query) => {
        //                 return query
        //                     .where('a', 1)
        //                     .orWhere('b', 2)
        //                     .where('a', (query) => {
        //                         return query
        //                             .where('a1', 'a2')
        //                             .where('a2', 'test');
        //                     });
        //             });
        //     })
        //     .getSql();

        // return this
        //     .select('a')
        //     .where('a', (query) => {
        //         return query
        //             .table('table1')
        //             .select('a')
        //             .where('test1', 1)
        //             .orWhere('test1', 2);
        //     })
        //     .where((query) => {
        //         return query
        //             .where('test2', 1)
        //             .orWhere('test2', 2);
        //     })
        //     .where('b', '>', (query) => {
        //         return query
        //             .table('table2')
        //             .select('b')
        //             .where('test2', 1)
        //             .orWhere('test2', 2);
        //     })
        //     .getSql();

        
    }

    getLast() {
        return this
            .selectRaw('*')
            .orderByDesc('id')
            .limit(1)
            .execute();
    }
}

let obj = new testTable({
    connection: mysqlConnection,
    table: 'testTable'
});
module.exports = obj;
