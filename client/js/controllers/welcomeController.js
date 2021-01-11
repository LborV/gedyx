var welcomeController = new Controller({
    name: 'welcomeController'
});

welcomeController.var1 = 12
welcomeController.var2 = function() {return 2*2}
welcomeController.arr = [
    {test: 'a', style: "color: red", arr: [1,2,3,4,5,6,7]}, 
    {test: 'b', style: "color: green"}, 
    {test: 'c', style: "color: blue", arr: [[1, 2, 3], [4, 5, 6], [7, 8, 9]]}];
welcomeController.isTitle = true

welcomeController.loadView('./views/welcome/welcome.html');
