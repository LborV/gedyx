/**
 * Every page base class
 */
class Controller {
    //Constructor
    constructor(config) {
        if(typeof config == 'string') {
            config = JSON.parse(config);
        }

        if(config.name === undefined) {
            console.log('You most give a name');
            return null;
        }

        this.element = document.getElementById(config.name);
        if(this.element != null) {
            console.log('This id exist');
            return null;
        }

        if(config.parent !== undefined && document.getElementById(config.parent) != undefined) {
            this.parent = config.parent;
        } else {
            this.parent = null;
        }

        this.name = config.name;
        this.classes = config.classes;

        if(config.view !== undefined) {
            if(this.updateView(config.view) == false) {
                return null;
            }

            if(config.show !== undefined) {
                this.show(config.show);
            } else {
                this.hide();
            }
        } else {
            if(globalThis.views === undefined) {
                globalThis.views = [];
            }

            this.createDOM();
            return this;
        }
    }

    //Update view
    updateView(view) {
        if(typeof view != 'string') {
            console.log('View sholud be a string');
            return false;
        }

        return this.updateDOM(view);
    }

    //Update DOM existing dom element
    updateDOM(view) {
        if(this.element == null) {
            if(this.createDOM()) {
                this.element = document.getElementById(this.name);
                this.element.innerHTML = view;
            } else {
                return false;
            }
        }

        this.element = document.getElementById(this.name);
        this.element.innerHTML = view;
        return true;
    }

    //Create new DOM element
    createDOM() {
        if(document.getElementById('content') == undefined) {
            document.body.innerHTML = document.body.innerHTML + '<div id="content"></div>';
        }

        if(this.parent == null) {
            document.getElementById('content').innerHTML = document.getElementById('content').innerHTML + '<div id='+this.name+'></div>';
        } else {
            document.getElementById(this.parent).innerHTML = document.getElementById(this.parent).innerHTML + '<div id='+this.name+'></div>';
        }
        this.element = document.getElementById(this.name);

        if(this.classes !== undefined) {
            if(!this.addClass(this.classes, false)) {
                return false;
            }
        }

        return true;
    }

    //On hide function
    onHide() {

    }

    //On show function
    onShow() {

    }

    //Show
    show(isShow = true, time = 0) {
        if(isShow) {
            this.onShow();
            this.element.style.display = 'block';
        } else {
            this.element.style.display = 'none';
        }

        return this;
    }

    //Get HTML
    getHTML() {
        return this.element.innerHTML;
    }

    //Set HTML
    html(str) {
        this.element.innerHTML = str;
    }

    //Hide
    hide(time = 0) {
        this.onHide();
        return this.show(false, time);
    }

    //Toggle
    toggle(time = 100) {
        if(this.element.style.display == 'none') {
            this.show(true, time);
        } else {
            this.hide(time);
        }

        return this;
    }

    //Add classes
    addClass(classes, returnThis = true) {
        this.classes = classes;

        if(this.element == null) {
            console.log('Id not found');
            return false;
        }

        if(typeof classes != 'string') {
            console.log('Classes should be a string');
            return false;
        }

        this.element.classList.add(this.classes);
        if(returnThis) {
            return this;
        }

        return true;
    }

    //Load view from file
    loadView(url, tree = false) {
        let response = 'Cant get view';
        let _controller = this;

        if(globalThis.views.length > 0) {
            let view = globalThis.views.find(el => el.url == url);
            if(view) {
                _controller.updateView(_controller.compileFromTree(JSON.parse(view.tree), url));
                return _controller;
            }
        }

        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                response = this.responseText;

                if(tree) {
                    return _controller.updateView(_controller.compileFromTree(JSON.parse(response), url));
                }

                return _controller.updateView(_controller.compile(response), url);
            }
        }

        xhttp.open("GET", url, true);
        xhttp.send();
        return _controller;
    }

    //Compile loaded view
    /**
     * 
     * @param {string} view 
     * @param {boolean} load if yes -> this.loadView -> this.updateView
     */
    compile(view, url) {
        let parser = new Parser();        
        let tree = parser.makeTreeFromString(view);
        
        if(url) {
            //Save tree in window for this session
            globalThis.views.push({
                url: url,
                tree: tree
            });
        }

        return parser.parse(false, this);
    }

    compileFromTree(tree, url) {
        let parser = new Parser();

        if(url) {
            //Save tree in window for this session
            globalThis.views.push({
                url: url,
                tree: tree
            });
        }
        
        return parser.parse(tree, this);
    }

    //Update
    update() {
        console.log('Redefine this method');
        return this;
    }
}