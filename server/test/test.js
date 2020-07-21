var assert = require('assert');
var model = require('../kernel/model.js');

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
            assert.equal(m.all().length, d.length);
        });

        it('Should return data from model where id == 1', function() {
            assert.equal(m.get(1).id, 1);
        });
    });

    describe('Where statements', function() {
        it('Should return 3 (where status == active)', function() {
            assert.equal(m.where([['status', 'active']]).length, 3);
            assert.equal(m.where([['status', '=', 'active']]).length, 3);
        });

        it('Should return 1 (where status == active and id > 2)', function() {
            assert.equal(m.where([['status', 'active'], ['id', '>', 2]]).length, 1);
        });

        it('Should return 2 (where status == active and id >= 1)', function() {
            assert.equal(m.where([['status', 'active'], ['id', '>=', 1]]).length, 2);
        });

        it('Should return 5 (like)', function() {
            assert.equal(m.where([['status', 'like', 'e']]).length, 5);
        });


        it('Should return 2 (whereIn)', function() {
            assert.equal(m.where([['id', 'whereIn', [0, 3]]]).length, 2);
        });
    });

    describe('Update', function() {
        it('Should return stutus = active', function() {
            m.update(4, {
                status: 'active'
            });

            assert.equal(m.get(4).status, 'active');

            m.set(2, 'status', 'active');

            assert.equal(m.get(2).status, 'active');
        });
    });

    describe('Delete', function() {
        it('Should return new count of elements == 4', function() {
            m.delete(1);
            assert.equal(m.all().length, 4);
        });
    });
});