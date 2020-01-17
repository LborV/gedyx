var welcomeController = new Controller({
    name: 'welcomeController'
});

welcomeController.var1 = 'abc';
welcomeController.var2 = () => {
    return 'Output of function';
}

welcomeController.arr = [
    'a',
    'b',
    'c'
];

welcomeController.object = {
    'key1': 'msg1',
    'key2': 'msg2'
}

welcomeController.object = {
    'key1': {
        'key_small1': 'val_small1'
    },
    'key2': {
        'key_small2': 'val_small2'
    }
}

welcomeController.isTitle = false;

welcomeController.loadView('./views/welcome.html');