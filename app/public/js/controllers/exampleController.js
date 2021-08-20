import {Controller} from '/kernel/Controller.js';

export default class exampleController extends Controller{
    constructor(settings) {
        super(settings);

        this.usersOnline = 0;
        this.items = [];
    }

    onShow() {
        console.log(`${this.id} controller showed`);
    }

    onLoad() {
        console.log('Loaded: '+this.name);
    }

    updateUsersOnline(users) {
        this.usersOnline = users;
        return this.reload();
    }

    setItems(items) {
        if(items.error) {
            alert('Error accured: '+items.error);
            return this.reload();
        }

        this.items = items;

        this.reload();
    }

    addNewTodo(text) {
        this.app.socket.emit('create', {
            status: 'active',
            text: text
        });
    }

    delete(index) {
        this.app.socket.emit('delete', {
            id: index
        });
    }

    complete(index) {
        this.app.socket.emit('complete', {
            id: index
        });
    }

    onUpdate() {
        let el = document.getElementById('inputNew');

        el.addEventListener("keyup", (event) => { 
            if(event.key === 'Enter') {
                event.preventDefault();
                this.addNewTodo(el.value)        
            }
        });

        el.focus();
    }
};