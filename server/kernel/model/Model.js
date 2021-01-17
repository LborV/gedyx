const ModelInterface = require('../interfaces/ModelInterface');

class Model {
    constructor(modelInterface) {
        if(modelInterface instanceof ModelInterface) {
            this.interface = modelInterface;
            return this;
        }

        return undefined;
    }

    execute(code) {
        return this.interface.execute(code);
    }

    async executeAsync(code) {
        return this.interface.executeAsync(code);
    }

    set(index, field, value) {
        return this.interface.set(index, field, value);
    }

    update(index, options) {
        return this.interface.update(index, options);
    }

    delete(index) {
        return this.interface.delete(index);
    }

    get(index) {
        return this.interface.get(index);
    }

    insert(data) {
        return this.interface.insert(data);
    }

    all() {
        return this.interface.all();
    }

    where(options) {
        return this.interface.where(options);
    }

    getInterface() {
        return this.interface;
    }
}

module.exports = Model;
