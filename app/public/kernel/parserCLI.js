const fs = require('fs');

module.exports = class Parser {
    constructor(config = {}) {
        this.tree = config.tree || [];
        this.noClosingTags = [
            'area',
            'base',
            'br',
            'col',
            'command',
            'embed',
            'hr',
            'img',
            'input',
            'keygen',
            'link',
            'meta',
            'param',
            'source',
            'track',
            'wbr'
        ];

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

        let includes = [...string.matchAll(/{include .*\.html}/g)];
        if(includes?.length) {
            let include = includes[0];
            let link = include[0].replace('{include ', '').replace('}', '');
            try {
                let data = fs.readFileSync('./public/views/' + link);
                return this.makeTreeFromString(string.replace(include[0], data.toString()))
            } catch(e) {
                console.log(e);
            }
        }

        this.interact(this.tree[0], this.tree[0].childs[0], string, 0);
        this.tree = this.clearEmptyNodes(this.tree);

        return this;
    }

    clearEmptyNodes(tree) {
        for(let i = 0; i < tree.length; i++) {
            if(tree[i].value === '' && tree[i].childs.length === 0) {
                tree.splice(i, 1);
                i--;
                continue;
            }

            if(tree[i].childs.length) {
                tree[i].childs = this.clearEmptyNodes(tree[i].childs);
            }
        }

        return tree;
    }

    interact(parent, node, string, index = 0) {
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

                        return this.interact(parent, parent.childs[parent.childs.length - 1], string, index + 2);
                    }

                    if(node.value.length == 1 && parent.type === 'if') {
                        //Parent new child text 
                        this.addChild(parent, 'text');

                        return this.interact(parent, parent.childs[parent.childs.length - 1], string, index + 2);
                    }
                } else {
                    param += string[index];
                }
            }
        }

        for(; index < string.length; index++) {
            let ch = string[index];
            let nextCh = string[index + 1];

            // Parse HTML nodes
            if(ch == '<') {
                if(nextCh === '/') {
                    for(; index < string.length; index++) {
                        if(string[index] === '>') {
                            return index;
                        }
                    }
                }

                let isClosing = false;
                let tagName = '';
                for(let i = index; i < string.length; i++) {
                    tagName += string[i];
                    
                    if(string[1 + i] === '>') {
                        break;
                    }
                }

                for(let tagIndex in this.noClosingTags) {
                    if(tagName.split(' ')[0].includes(this.noClosingTags[tagIndex])) {
                        isClosing = true;
                        break;
                    }
                }

                if(isClosing) {
                    this.addChild(parent, 'noClosingTag');
                    index += 1;
                    for(; index < string.length; index++) {
                        parent.childs[parent.childs.length - 1].value += string[index];

                        if(string[index + 1] === '>') {
                            this.addChild(parent, 'text');
                            return this.interact(parent, parent.childs[parent.childs.length - 1], string, index + 2);
                        }
                    }

                }

                this.addChild(parent, 'tag');
                index += 1;
                for(; index < string.length; index++) {
                    parent.childs[parent.childs.length - 1].value += string[index];
                    if(string[index + 1] === '>') {
                        this.addChild(parent.childs[parent.childs.length - 1], 'text');

                        index = this.interact(parent.childs[parent.childs.length - 1], parent.childs[parent.childs.length - 1].childs[0], string, index + 2);
                        this.addChild(parent, 'text');
                        return this.interact(parent, parent.childs[parent.childs.length - 1], string, index + 1);
                    }
                }

            } else if(ch == '{') {
                switch(nextCh) {
                    //Variable
                    case '{':
                        //Parent new child var
                        this.addChild(parent, 'variable');

                        //Parse while var not closed
                        index = this.interact(parent, parent.childs[parent.childs.length - 1], string, index + 2);
                        //Parent new child text 
                        this.addChild(parent, 'text');

                        //Go next
                        return this.interact(parent, parent.childs[parent.childs.length - 1], string, index);
                    //Loop
                    case 'f':
                        //Parent new child loop
                        this.addChild(parent, 'loop');

                        //Loop node new child params
                        this.addChild(parent.childs[parent.childs.length - 1], 'params');

                        //Parse while loop not closed
                        index = this.interact(parent.childs[parent.childs.length - 1], parent.childs[parent.childs.length - 1].childs[0], string, index + 3);
                        this.addChild(parent, 'text');

                        //Go next
                        return this.interact(parent, parent.childs[parent.childs.length - 1], string, index + 1);
                    //If
                    case 'i':
                        //Parent new child if
                        this.addChild(parent, 'if');

                        //If node new child params
                        this.addChild(parent.childs[parent.childs.length - 1], 'params');

                        //Parse while if not closed
                        index = this.interact(parent.childs[parent.childs.length - 1], parent.childs[parent.childs.length - 1].childs[0], string, index + 3);
                        this.addChild(parent, 'text');

                        //Go next
                        return this.interact(parent, parent.childs[parent.childs.length - 1], string, index + 1);
                    //Just text
                    default:
                        node.value += ch != '\\' ? ch : '';
                        break;
                }
            } else if(ch == '}' && nextCh == '}') {
                return index + 2;
            } else if((ch == ':' && string[index - 1] !== '\\') && nextCh == '!' && string[index + 2] == '}') {
                return index + 3;
            } else if((ch == ':' && string[index - 1] !== '\\') && parent.type == 'if') {
                this.addChild(parent, 'else');

                this.addChild(parent.childs[parent.childs.length - 1], 'text');

                return this.interact(parent.childs[parent.childs.length - 1], parent.childs[parent.childs.length - 1].childs[0], string, index + 1);
            } else {
                node.value += ch != '\\' ? ch : '';
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