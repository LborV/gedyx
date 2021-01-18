module.exports = class Parser {
    constructor(config = {}) {
        this.tree = config.tree || [];
        this.result = '';
    }

    /**
     * Tokens:
     *  text
     *  var
     *  loop
     *  if
     */
    makeTreeFromString(string) {
        if(typeof string !== 'string') {
            return false;
        }

        this.tree = [];
        this.tree.push({
            type: 'core',
            value: '',
            childs: []
        });

        if(!string.length) {
            return false;
        }
        this.addChild(this.tree[0], 'text');

        return this.iteract(this.tree[0], this.tree[0].childs[0], string, 0);
    }

    iteract(parent, node, string, index = 0) {
        //Get params for loop
        if(node.type === 'params') {
            node.value = [];
            let param = '';
            for(; index < string.length; index++) {
                if(string[index] == ':') {
                    node.value.push(param);
                    param = '';

                    if(node.value.length == 2 && parent.type === 'loop') {
                        //Parent new child text 
                        this.addChild(parent, 'text');

                        return this.iteract(parent, parent.childs[parent.childs.length - 1], string, index + 2);
                    }

                    if(node.value.length == 1 && parent.type === 'if') {
                        //Parent new child text 
                        this.addChild(parent, 'text');

                        return this.iteract(parent, parent.childs[parent.childs.length - 1], string, index + 2);
                    }
                } else {
                    param += string[index];
                }
            }
        }
        
        for(; index < string.length; index++) {
            let ch = string[index];
            let nextCh = string[index+1];

            // if special characters
            if(ch == '{') {
                switch(nextCh) {
                    //Variable
                    case '{':
                        //Parent new child var
                        this.addChild(parent, 'variable');

                        //Parse while var not closed
                        index = this.iteract(parent, parent.childs[parent.childs.length - 1], string, index+2);
                        //Parent new child text 
                        this.addChild(parent, 'text');

                        //Go next
                        return this.iteract(parent, parent.childs[parent.childs.length - 1], string, index);
                    //Loop
                    case 'f':
                        //Parent new child loop
                        this.addChild(parent, 'loop');

                        //Loop node new child params
                        this.addChild(parent.childs[parent.childs.length - 1], 'params');

                        //Parse while loop not closed
                        index = this.iteract(parent.childs[parent.childs.length - 1], parent.childs[parent.childs.length - 1].childs[0], string, index+3);
                        this.addChild(parent, 'text');

                        //Go next
                        return this.iteract(parent, parent.childs[parent.childs.length - 1], string, index);
                    //If
                    case 'i':
                        //Parent new child if
                        this.addChild(parent, 'if');

                        //If node new child params
                        this.addChild(parent.childs[parent.childs.length - 1], 'params');

                        //Parse while if not closed
                        index = this.iteract(parent.childs[parent.childs.length - 1], parent.childs[parent.childs.length - 1].childs[0], string, index+3);
                        this.addChild(parent, 'text');

                        //Go next
                        return this.iteract(parent, parent.childs[parent.childs.length - 1], string, index);
                    //Just text
                    default:
                        node.value += ch;
                        break;
                }
            } else if(ch == '}' && nextCh == '}') {
                return index + 2;
            } else if(ch == ':' && nextCh == '!' && string[index+2] == '}') {
                return index + 3;
            } else if(ch == ':' && parent.type == 'if') {
                this.addChild(parent, 'else');

                this.addChild(parent.childs[parent.childs.length - 1], 'text');

                return this.iteract(parent.childs[parent.childs.length - 1], parent.childs[parent.childs.length - 1].childs[0], string, index + 1);
            } else {
                node.value += ch;
            }
        }

        return this;
    }

    parse(tree = false, _this = false) {
        console.error('Can\'t parse in cli mode!');
    }

    addChild(parent, type) {
        parent.childs.push({
            type: type,
            value: '',
            childs: []
        });
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