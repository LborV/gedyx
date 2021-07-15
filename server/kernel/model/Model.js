const QueryBuilder = require('../queryBuilder/MysqlQueryBuilder');

class Model {
    constructor(queryBuilder) {
        if(queryBuilder instanceof QueryBuilder) {
            return queryBuilder;
        }

        return undefined;
    }
}

module.exports = Model;
