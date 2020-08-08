var welcomeController = new Controller({
    name: 'welcomeController'
});

welcomeController.var1 = 12
welcomeController.var2 = function() {return 2*2}
welcomeController.arr = [{test: 'a', style: "color: red"}, {test: 'b', style: "color: green"}, {test: 'c', style: "color: blue"}];
welcomeController.isTitle = true

welcomeController.loadView('./views/welcome/welcome.html');