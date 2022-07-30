
import {Controller} from '/build/kernel/Controller.min.js';

export default class test extends Controller{
    constructor(settings) {
        super(settings);

        this.var1 = 'SOME TEXT2';
    }

    onShow() {
        console.log('Showed: '+this.name);
    }

    onLoad() {
        console.log('Loaded: '+this.name);
    }

    onUpdate() {
        console.log('Updated: '+this.name)
    }
};
    
