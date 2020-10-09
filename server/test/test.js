var assert = require('assert');
var model = require('../kernel/model.js');
var migration = require('../kernel/migration.js');

describe('Model without db', function () {
    let d = [
        {id: 0, status: 'active', count: 123},
        {id: 1, status: 'active', count: 34},
        {id: 2, status: 'disable', count: 10},
        {id: 3, status: 'active', count: -34},
        {id: 4, status: 'disable', count: 0}
    ];
    let m = new model({
        data: d
    });

    describe('Get all data', function() {
        it('Should return all data from model', function() {
            assert.strictEqual(m.all().length, d.length);
        });

        it('Should return data from model where id == 1', function() {
            assert.strictEqual(m.get(1).id, 1);
        });
    });

    describe('Where statements', function() {
        it('Should return 3 (where status == active)', function() {
            assert.strictEqual(m.where([['status', 'active']]).length, 3);
            assert.strictEqual(m.where([['status', '=', 'active']]).length, 3);
        });

        it('Should return 1 (where status == active and id > 2)', function() {
            assert.strictEqual(m.where([['status', 'active'], ['id', '>', 2]]).length, 1);
        });

        it('Should return 2 (where status == active and id >= 1)', function() {
            assert.strictEqual(m.where([['status', 'active'], ['id', '>=', 1]]).length, 2);
        });

        it('Should return 5 (like)', function() {
            assert.strictEqual(m.where([['status', 'like', 'e']]).length, 5);
        });


        it('Should return 2 (whereIn)', function() {
            assert.strictEqual(m.where([['id', 'whereIn', [0, 3]]]).length, 2);
        });
    });

    describe('Update', function() {
        it('Should return status = active', function() {
            m.update(4, {
                status: 'active'
            });

            assert.strictEqual(m.get(4).status, 'active');

            m.set(2, 'status', 'active');

            assert.strictEqual(m.get(2).status, 'active');
        });
    });

    describe('Delete', function() {
        it('Should return new count of elements == 4', function() {
            m.delete(1);
            assert.strictEqual(m.all().length, 4);
        });
    });

    describe('Insert', function() {
        it('Should return new count of elements == 5', function() {
            m.insert({id: 5, status: 'disable', count: 0});
            assert.strictEqual(m.all().length, 5);
        });

        it('Should return new count of elements == 6', function() {
            m.insert({status: 'disable', count: 0});
            assert.strictEqual(m.all().length, 6);
        });

        it('Should return new count of elements == 100', function() {
            for(let i = 0; i < 94; i++) {
                m.insert({status: 'disable', count: i});                
            }
            assert.strictEqual(m.all().length, 100);
        });
    });
});

describe('Model and migrations with db', function () {
    let config = {
        host: "localhost",
        user: "userName",
        password: "password",
        db: 'testDatabase'
    }

    //Migration
    describe('Migration', function() {
        var _migration = new migration({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.db,
        }, true);
        
        _migration.migrate([
            {table: 'testTable', drop: false, name: 'testColumn_first', type: 'int'},
            {table: 'testTable', drop: false, name: 'testColumn_second', type: 'int'}
        ]);
    
        let tableDescription = [ 
            { Field: 'id',
            Type: 'int',
            Null: 'NO',
            Key: 'PRI',
            Default: null,
            Extra: 'auto_increment' },
        { Field: 'testColumn_first',
            Type: 'int',
            Null: 'YES',
            Key: '',
            Default: null,
            Extra: '' },
        { Field: 'testColumn_second',
            Type: 'int',
            Null: 'YES',
            Key: '',
            Default: null,
            Extra: '' } 
        ];

        let tableDescription2 = [ 
            { Field: 'id',
            Type: 'int',
            Null: 'NO',
            Key: 'PRI',
            Default: null,
            Extra: 'auto_increment' },
        { Field: 'testColumn_first',
            Type: 'text',
            Null: 'YES',
            Key: '',
            Default: null,
            Extra: '' },
        { Field: 'testColumn_second',
            Type: 'text',
            Null: 'YES',
            Key: '',
            Default: null,
            Extra: '' } 
        ];
    
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
    
        it('Check table after creation migration', function() {
            assert.deepStrictEqual(m.describe(), tableDescription);
        });

        it('Check table after modify columns migration', function() {
            _migration.migrate([
                {table: 'testTable', drop: false, name: 'testColumn_first', type: 'text', action: 'MODIFY COLUMN'},
                {table: 'testTable', drop: false, name: 'testColumn_second', type: 'text', action: 'MODIFY COLUMN'}
            ]);

            assert.deepStrictEqual(m.describe(), tableDescription2);
        });
    });

    //Migration
    describe('Model', function() {
        describe('Insert', function() {
            //TODO: fix empty rows
            it('Should return new count of elements == 1', function() {
                m.insert({testColumn_first: 'disable', testColumn_second: 'testMe'});
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
    });
  
});