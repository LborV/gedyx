//This file was automaticaly generated
//Feel free to edit :)

const MysqlQueryBuilder = require('../kernel/queryBuilder/MysqlQueryBuilder');    
class testTable extends MysqlQueryBuilder {
    test() {
        // this.insert({
        //     testColumn_first: 'testMe',
        //     testColumn_second: 'Random String'
        // }).execute();

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
        //     .where((query) => {
        //         return query
        //             .where('id', 120)
        //             .orWhere('id', 130);
        //     })
        //     .orWhere('id', '>', 150)
        //     .limit(10)
        //     .execute();
    
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
