import {Controller} from '/kernel/Controller.js';

export default class welcomeController extends Controller{
    constructor(settings) {
        super(settings);

        this.arr = [
            1, 2, 3, 4
        ];
    }

    onShow() {
        console.log(`${this.id} controller showed`);
    }

    onLoad() {
        console.log('TEST');
    }
};