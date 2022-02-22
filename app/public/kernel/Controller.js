import {Parser} from '/kernel/Parser.min.js';

/**
 * Every page base class
 */
export class Controller {
    /**
     * The constructor function creates a new instance of the Controller class. It takes a config
     * object as an argument. If the config object has an id property, it will set the id property of
     * the new instance to the value of the id property of the config object. If the config object has
     * a parent property, it will set the parent property of the new instance to the value of the
     * parent property of the config object. If the config object has a name property, it will set the
     * name property of the new instance to the value of the name property of the config object. If the
     * config object has a view property, it will set the view property of the new instance to the
     * value of the view property of the config object. If the config object has a showOnLoad property,
     * it will set the showOnLoad property of the new instance to the value of the showOnLoad property
     * of the config object. If the config object has a app property, it will set the app property of
     * the new
     * @param [config] - {
     * @returns The controller object.
     */
    constructor(config = {}) {
        if(config.id === undefined) {
            console.error('You most give a id');
            return null;
        }

        this.element = document.getElementById(config.id);

        if(config.parent !== undefined && document.getElementById(config.parent) != undefined) {
            this.parent = config.parent;
        } else {
            this.parent = null;
        }

        if(config.name) {
            this.name = config.name;
        }

        this.id = config.id;
        this.classes = config.classes;
        this.isLoaded = false;
        this.parser = new Parser({noData: config.onError || false});        

        this.showOnLoad = false;
        if(config.showOnLoad !== undefined) {
            this.showOnLoad = config.showOnLoad;
        }

        if(config.view !== undefined) {
            if(this.updateView(config.view) == false) {
                return null;
            }
        } else {
            if(globalThis.views === undefined) {
                globalThis.views = [];
            }

            this.createDOM();
        }
        
        if(config.app) {
            this.app = config.app;
        } else {
            throw 'Controller must be defined by Application class!';
        }

        if(config.url) {
            this.url = config.url;
        }

        this.onLoad();
        return this;
    }

    /**
     * If the view has a URL, fetch the view from the server and load it. Otherwise, load the view from the
     * DOM
     */
    init() {
        try {
            if(this.url) {
                this.fetchView(this.url)
                .then((response) => {
                    if(typeof response === 'string') {
                        return this.loadView(response, this.url, true);
                    }
        
                    return this.updateView(this.compileFromTree(response.tree));
                })
                .catch(error => console.error(error));
            } else {
                this.onViewLoaded();
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Update the view by updating the DOM
     * @param view - The view to be updated.
     * @returns Nothing.
     */
    updateView(view) {
        if(typeof view != 'string') {
            console.error('View should be a string');
            return false;
        }

        return this.updateDOM(view);
    }

    /**
     * Update the DOM with the view
     * @param view - The view to be loaded into the DOM.
     * @returns Nothing.
     */
    updateDOM(view) {
        if(this.element == null) {
            if(this.createDOM()) {
                this.isLoaded = true;
                this.element = document.getElementById(this.id);
                this.element.innerHTML = view;
                this.onViewLoaded();
                return true;
            } else {
                return false;
            }
        }

        this.isLoaded = true;
        this.element = document.getElementById(this.id);
        this.element.innerHTML = view;
        this.onViewLoaded();
        return true;
    }

    /**
     * Create the DOM element for this object
     * @returns Nothing.
     */
    createDOM() {
        if(this.parent == null) {
            if(document.getElementById('content') == undefined) {
                document.body.innerHTML = document.body.innerHTML + '<div id="content"></div>';
            }
            
            document.getElementById('content').innerHTML = document.getElementById('content').innerHTML + '<div id='+this.id+'></div>';
        } else {
            document.getElementById(this.parent).innerHTML = document.getElementById(this.parent).innerHTML + '<div id='+this.id+'></div>';
        }
        this.element = document.getElementById(this.id);

        if(this.classes !== undefined) {
            if(!this.addClass(this.classes, false)) {
                return false;
            }
        }

        return true;
    }

    /**
     * The onHide function is called when the component is hidden
     */
    onHide() {

    }

    /**
     * This function is called when the component is shown
     */
    onShow() {

    }

    /**
     * This function will show or hide the element with the given id
     * @param [isShow=true] - Boolean, true if the element should be shown, false if it should be hidden.
     * @param [time=0] - The time in milliseconds.
     * @returns Nothing.
     */
    show(isShow = true, time = 0) {
        this.element = document.getElementById(this.id);
        if(isShow) {
            this.onShow();
            this.element.style.display = 'block';
        } else {
            this.element.style.display = 'none';
        }

        return this;
    }

    /**
     * Return the innerHTML of the element
     * @returns The innerHTML of the element.
     */
    getHTML() {
        return this.element.innerHTML;
    }

    /**
     * It takes a string as an argument and sets the innerHTML of the element to that string
     * @param str - The string to be displayed.
     */
    html(str) {
        this.element.innerHTML = str;
    }

    /**
     * Hide the element
     * @param [time=0] - The time in milliseconds.
     * @returns Nothing is being returned.
     */
    hide(time = 0) {
        this.onHide();
        return this.show(false, time);
    }

    /**
     * If the element is hidden, show it. If the element is visible, hide it
     * @param [time=100] - The time in milliseconds.
     * @returns The object itself.
     */
    toggle(time = 100) {
        if(this.element.style.display == 'none') {
            this.show(true, time);
        } else {
            this.hide(time);
        }

        return this;
    }

    /**
     * Adds a class to the element
     * @param classes - The class name to add to the element.
     * @param [returnThis=true] - If you want to return the element, set this to true.
     * @returns Nothing.
     */
    addClass(classes, returnThis = true) {
        this.classes = classes;

        if(this.element == null) {
            console.error('Id not found');
            return false;
        }

        if(typeof classes != 'string') {
            console.error('Classes should be a string');
            return false;
        }

        this.element.classList.add(this.classes);
        if(returnThis) {
            return this;
        }

        return true;
    }

    /**
     * It takes the current view and compiles it into a tree
     * @returns Nothing.
     */
    refresh() {
        let view = globalThis.views.find(el => el.url == this.url);
        if(globalThis.views.length > 0) {
            if(view) {
                this.updateView(this.compileFromTree(view.tree));
                return this;
            }
        }

        return false;
    }

    /**
     * It takes a response and a url, and if the url is in the globalThis.views array, it updates the view
     * with the compiled tree. Otherwise, it compiles the response and updates the view with the compiled
     * tree
     * @param response - The response from the server.
     * @param url - The url of the view to load.
     * @param [tree=false] - If true, the response will be parsed as a tree.
     * @returns Nothing.
     */
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

    /**
     * It takes a URL and returns the view's HTML
     * @param url - The url of the view to fetch.
     * @returns Nothing.
     */
    async fetchView(url) {
        let view = globalThis.views.find(el => el.url == url);
        if(globalThis.views.length > 0 && view) {
            return view;
        }

        const result = await fetch(url);
        if(result.status == 200) {
            return result.text();
        } else {
            throw `Can't fetch view, request status ${result.status}`;
        }
    }

    /**
     * It takes a URL, fetches the view from the server, compiles it into a tree, and then updates the view
     * @param url - The URL of the view to load.
     */
    async view(url) {
        if(typeof url !== 'string') {
            throw 'Wrong URL';
        }

        this.url = url;
        this.fetchView(url)
        .then((response) => {
            if(typeof response === 'string') {
                return this.loadView(response, url, true).show();
            }

            return this.updateView(this.compileFromTree(response.tree));
        })
        .catch(error => console.error(error));
    }

    /**
     * When the view is loaded, the app calls the view's onViewLoaded function
     * @returns Nothing.
     */
    onViewLoaded() {
        if(this.app && this.name) {
            this.app.viewLoaded(this.name);
        }

        return this.onUpdate();
    }

    /**
     * The request function is used to send a request to the server
     * @param name - The name of the request.
     * @param data - The data to be sent to the server.
     * @param callback - The callback function that will be called when the request is completed.
     */
    request(name, data, callback) {
        this.app.request(name, data, callback);
    }

    /**
     * It takes a view and a url, and returns a compiled view
     * @param view - The view to compile.
     * @param url - The url of the view.
     * @returns The compiled template.
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

    /**
     * It takes a tree and a url, and returns a JavaScript object
     * @param tree - The tree to compile.
     * @param url - The url of the view.
     * @returns The return value is the result of the parse() method.
     */
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

    onUpdate() {
        console.info('Redefine me');
    }

    onLoad() {
        console.info('Redefine me');
    }
}