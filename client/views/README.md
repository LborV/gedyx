## Содержние:
- [Главная]()
- Бэкенд
    - [Миграции](server/migrations)
    - [Модель](server/models)
- Фронтенд
    - [View](client/views)
    - [Контролер](client/js/controllers)

# View
Генерируется из обычного HTML кода и псевдо языка разметки.
Поддерживает функции:
- Условные операторы
```
{i:Условие:
    Этот код будет выведен если условие верно
    :
    Этот код будет выведен если условие ложно
:!}
```
- Прохождением циклом по массивам
```
{f:Массив:Названиеелемента:
    В каждой итерации будет доступен следующий елемент массива под именем 'Названиеелемента'
:!}
```
> на данный момент вложженые елементы работают не корректно
- Вставку переменных
{{ПеременнаяКоторуюСлудуетВывести}}

----

Пример использования:
Допустим у нас есть welcomeController, который выглядит так:
```
var welcomeController = new Controller({
    name: 'welcomeController'
});

welcomeController.var1 = 12
welcomeController.var2 = function() {return 2*2}
welcomeController.arr = [1, 2, 3]
welcomeController.isTitle = true

welcomeController.loadView('./views/welcome/welcome.html');
```
А View выглядит так:
```
<h1>Var1 = {{welcomeController.var1}}</h1>
<h1>Var2 = {{welcomeController.var2()}}</h1>


<ul>
    {f:welcomeController.arr:el:
        <li>{{el}}</li>
    :!}
</ul>


{i:welcomeController.isTitle:
    <h1>True</h1>
    :
    <h1>False</h1>
:!}

<h1>TEXT</h1>
```

Тогда в результате на странице будет слудующий код:

<div id="welcomeController"><h1>Var1 = 12</h1>
<h1>Var2 = 4</h1>


<ul>
    
        <li>1</li>
    
        <li>2</li>
    
        <li>3</li>
    
</ul>



    <h1>True</h1>
    

<h1>TEXT</h1></div>