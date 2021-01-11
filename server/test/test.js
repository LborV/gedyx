var assert = require('assert');
var model = require('../kernel/model/model.js');

describe('Model and migrations with db', function () {
    let config = {
        host: "localhost",
        user: "login",
        password: "pass",
        db: 'testDatabase'
    }

    //Model
    class testModel extends model {

    }
    
    m = new testModel ({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.db,
        table: 'testTable',
    });

    //Migration
    describe('Model', function() {
        describe('Raw sql', function() {
            it('Truncate table', function() {
                m.execute('TRUNCATE `testTable`');
                assert.strictEqual(m.all().length, 0);
            });
        });

        describe('Insert', function() {
            it('Should return new count of elements == 1', function() {
                m.insert({testColumn_first: 'enable', testColumn_second: 'testMe'});
                assert.strictEqual(m.all().length, 1);
            });
    
            it('Should return new count of elements == 100', function() {
                console.log(m.all())

                for(let i = 0; i < 99; i++) {
                    m.insert({testColumn_first: 'disable', testColumn_second: 'testMe'});                
                }

                assert.strictEqual(m.all().length, 100);
            });
        });

        describe('Where', function() {
            it('Should find elements count == 1', function() {
                assert.strictEqual(m.where([['testColumn_first', `'enable'`]]).length, 1);
            });
            it('Should find elements count == 1', function() {
                assert.strictEqual(m.where([['testColumn_first', '=', `'enable'`]]).length, 1);
            });
            it('Should find elements count == 5', function() {
                assert.strictEqual(m.where([['id', '>=', '1'], ['id', '<=', '5']]).length, 5);
            });
        });

        describe('Get', function() {
            it('Element id should be 5', function() {
                assert.strictEqual(m.get(5).id, 5);
            });
        });

    });
});