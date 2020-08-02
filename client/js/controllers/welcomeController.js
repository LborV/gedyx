var welcomeController = new Controller({
    name: 'welcomeController'
});

welcomeController.var1 = 12
welcomeController.var2 = function() {return 2*2}
welcomeController.arr = ['a', 'b', 'c'];
welcomeController.isTitle = true

welcomeController.loadView('./views/welcome/welcome.html');