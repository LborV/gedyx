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

welcomeController.isTitle = false;

welcomeController.loadView('./views/welcome.html');