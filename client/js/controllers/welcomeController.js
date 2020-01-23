var welcomeController = new Controller({
    name: 'welcomeController'
});

welcomeController.var1 = 'abc';
welcomeController.var2 = () => {
    return 'Output of function';
}

welcomeController.list = (el) => {
    window['temp'] = el;
    return welcomeController.compile(welcomeController.loadView('./views/welcome/listInList.html', false));
}

welcomeController.arr = [
    ['a', 'b'],
    ['c', 'd']
];

welcomeController.isTitle = false;

welcomeController.loadView('./views/welcome/welcome.html');