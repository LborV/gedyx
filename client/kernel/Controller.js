import {Parser} from '/kernel/Parser.js';

/**
 * Every page base class
 */
export class Controller {
    //Constructor
    constructor(config = {}) {
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
        this.isLoaded = false;
        this.parser = new Parser();        

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
        }
        if(config.app) {
            this.app = config.app;
        }

        try {
            if(config.url) {
                this.url = config.url;
                this.fetchView(config.url)
                .then((response) => {
                    return this.loadView(response, config.url, true);
                })
                .catch(error => console.error(error));
            }
        } catch (error) {
            throw error;
        }

        return this;
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
                this.isLoaded = true;
                this.element = document.getElementById(this.name);
                this.element.innerHTML = view;
                this.onViewLoaded();
                return true;
            } else {
                return false;
            }
        }

        this.isLoaded = true;
        this.element = document.getElementById(this.name);
        this.element.innerHTML = view;
        this.onViewLoaded();
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
        this.element = document.getElementById(this.name);
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

    reload() {
        let view = globalThis.views.find(el => el.url == this.url);
        if(globalThis.views.length > 0) {
            if(view) {
                this.updateView(this.compileFromTree(view.tree));
                return this;
            }
        }

        return false;
    }

    //Load view from file
    loadView(response, url, tree = false) {
        let view = globalThis.views.find(el => el.url == url);
        if(globalThis.views.length > 0) {
            if(view) {
                this.updateView(this.compileFromTree(view.tree));
                return this;
            }
        }

        if(tree) {
            this.updateView(this.compileFromTree(JSON.parse(response), url));
            return this;
        }

        this.updateView(this.compile(response), url);
        return this;        
    }

    async fetchView(url) {
        const result = await fetch(url);
        if(result.status == 200) {
            return result.text();
        } else {
            throw `Can't fetch view, request status ${result.status}`;
        }
    }

    // App count how many loaded
    onViewLoaded() {
        if(this.app) {
            return this.app.viewLoaded();
        }

        return false;
    }

    //Compile loaded view
    /**
     * 
     * @param {string} view 
     * @param {boolean} load if yes -> this.loadView -> this.updateView
     */
    compile(view, url) {
        let tree = this.parser.clear().makeTreeFromString(view);
        
        if(url) {
            //Save tree in globalThis for this session
            globalThis.views.push({
                url: url,
                tree: tree
            });
        }

        return this.parser.clear().parse(false, this);
    }

    compileFromTree(tree, url) {
        if(url) {
            //Save tree in globalThis for this session
            globalThis.views.push({
                url: url,
                tree: tree
            });
        }
        
        return this.parser.clear().parse(tree, this);
    }

    onLoad() {
        console.log('Redifine me');
    }
}