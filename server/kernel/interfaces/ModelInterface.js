class ModelInterface {
    constructor(config) {

    }

    execute(code) {
        console.error('execute function is not realized in this interface');
    }

    async executeAsync(code) {
        console.error('executeAsync function is not realized in this interface');
    }

    set(index, field, value) {
        console.error('set function is not realized in this interface');
    }

    update(index, options) {
        console.error('update function is not realized in this interface');
    }

    delete(index) {
        console.error('delete function is not realized in this interface');
    }

    get(index) {
        console.error('get function is not realized in this interface');
    }

    insert(data) {
        console.error('insert function is not realized in this interface');
    }

    all() {
        console.error('all function is not realized in this interface');
    }

    where(options) {
        console.error('where function is not realized in this interface');
    }

    createTable(tableName, options) {
        console.error('createTable function is not realized in this interface');
    }

    dropTable(tableName) {
        console.error('dropTable function is not realized in this interface');
    }

    updateTable(tableName, options) {
        console.error('updateTable function is not realized in this interface');
    }

    getLastId() {
        console.error('getLastId function is not realized in this interface');
    }
}

module.exports = ModelInterface;
