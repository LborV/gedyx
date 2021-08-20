export class Parser {
    constructor(config = {}) {
        this.tree = config.tree || [];
        this.result = '';

        this.noData = config.noData || false;
    }

    parse(tree = false, _this = false) {
        let t = this.tree[0];
        if(tree) {
            t = tree;
        }

        if(t.childs.length == 0) {
            return false;
        }

        if(_this) {
            globalThis._this = _this;
        }

        t.childs.forEach(child => {
            if(child.type == 'text') {
                this.result += child.value;
                return;
            }

            if(child.type == 'variable') {
                this.result += eval(child.value);
                return;
            }

            if(child.type == 'loop') {
                let params = child.childs.find(el => el.type == 'params');
                if(!params) {
                    this.result += this.noData || '!Can\'t find params!';
                    return;
                }

                let arr = eval(params.value[0]);
                let iteratorName = params.value[1];
                if(typeof arr === 'object') {
                    let keys = Object.keys(arr);
                    keys.forEach(key => {
                        globalThis['_loopIndex'] = key;
                        globalThis[iteratorName] = arr[key];
                        return this.parse(child, _this);
                    });
                    delete globalThis[iteratorName];
                    delete globalThis['_loopIndex'];
                    return;
                } else if(Array.isArray(arr)) {
                    arr.forEach((item, index) => {
                        globalThis['_loopIndex'] = index;
                        globalThis[iteratorName] = item;
                        return this.parse(child, _this);
                    });
                    delete globalThis[iteratorName];
                    delete globalThis['_loopIndex'];
                    return;
                }

                this.result += this.noData || '!Wrong type of array!';
                return;
            }

            if(child.type == 'if') {
                let params = child.childs.find(el => el.type == 'params');
                if(!params) {
                    this.result += this.noData || '!Can\'t find params!';
                    return;
                }

                if(eval(params.value[0])) {
                    return this.parse(child, _this);
                } else {
                    let elsePart = child.childs.find(el => el.type == 'else');
                    if(elsePart) {
                        return this.parse(elsePart, _this);
                    }
                }

                return;
            }
        });
        delete globalThis._this;

        return this.result;
    }

    clear() {
        this.result = '';
        return this;
    }

    setTree(tree) {
        this.tree = tree;
        return this;
    }

    getTree() {
        return this.tree;
    }

    getResult() {
        return this.result;
    }
}