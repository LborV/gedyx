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
        try {
            return this.interface?.execute(code) ?? [];
        } catch(e) {
            console.error(e);
        }
    }

    async executeAsync(code) {
        try {
            return this.interface?.executeAsync(code) ?? [];
        } catch(e) {
            console.error(e);
        }
    }

    set(index, field, value) {
        try {
            return this.interface?.set(index, field, value) ?? [];
        } catch(e) {
            console.error(e);
        }
    }

    update(index, options) {
        try {
            return this.interface?.update(index, options) ?? [];
        } catch(e) {
            console.error(e);
        }
    }

    delete(index) {
        try {
            return this.interface?.delete(index) ?? [];
        } catch(e) {
            console.error(e);
        }
    }

    get(index) {
        try {
            return this.interface?.get(index) ?? [];
        } catch(e) {
            console.error(e);
        }
    }

    insert(data) {
        try {
            return this.interface?.insert(data) ?? [];
        } catch(e) {
            console.error(e);
        }
    }

    all() {
        try {
            return this.interface?.all() ?? [];
        } catch(e) {
            console.error(e);
        }
    }

    where(options) {
        try {
            return this.interface?.where(options) ?? [];
        } catch(e) {
            console.error(e);
        }
    }

    getInterface() {
        return this.interface;
    }
}

module.exports = Model;
