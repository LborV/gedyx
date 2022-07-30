export class Parser {
    /**
     * The constructor function takes a config object as an argument. The config object can contain a tree
     * property, which is an array of objects. The constructor function also has a default value for the
     * tree property, which is an empty array
     * @param [config] - an object containing the following properties:
     */
    constructor(config = {}) {
        this.tree = config.tree || [];
        this.result = '';

        this.noData = config.noData || false;
    }

    /**
     * It takes a tree of nodes and a context, and returns the result of the parsed tree
     * @param [tree=false] - The tree of the template.
     * @param [_this=false] - the current object, which is the object that contains the template.
     * @returns The result of the parsing.
     */
    parse(tree = false, _this = false, html = false) {
        let t = this.tree[0];
        if(tree) {
            t = tree;
        }

        if(t.childs.length == 0 && !html) {
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
                this.result += Function('"use strict";return ((_this) => {return ' + child.value + '})')()(_this);
                return;
            }

            if(child.type == 'loop') {
                let params = child.childs.find(el => el.type == 'params');
                if(!params) {
                    this.result += this.noData || '!Can\'t find params!';
                    return;
                }

                let arr = Function('"use strict";return ((_this) => {return ' + params.value[0] + '})')()(_this);
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

                if(Function('"use strict";return ((_this) => {return ' + params.value[0] + '})')()(_this)) {
                    return this.parse(child, _this);
                } else {
                    let elsePart = child.childs.find(el => el.type == 'else');
                    if(elsePart) {
                        return this.parse(elsePart, _this);
                    }
                }

                return;
            }

            if(child.type === 'noClosingTag') {
                this.result += '<' + child.value + ' />';
                return;
            }

            if(child.type === 'tag') {
                this.result += '<' + child.value + '>';
                this.parse(child, _this, true);
                this.result += '</' + child.value + ' >';
                return;
            }
        });
        delete globalThis._this;

        return this.result;
    }

    /**
     * Clear the result
     * @returns Nothing.
     */
    clear() {
        this.result = '';
        return this;
    }

    /**
     * Set the tree variable to the tree parameter
     * @param tree - The tree to be used for the search.
     * @returns The object itself.
     */
    setTree(tree) {
        this.tree = tree;
        return this;
    }

    /**
     * Return the tree
     * @returns The tree object.
     */
    getTree() {
        return this.tree;
    }

    /**
     * Return the result
     * @returns The result of the function.
     */
    getResult() {
        return this.result;
    }
}