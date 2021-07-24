# Фронтенд
Фронтенд должен сервиться как статичные файлы, например при помощи NGINX (смотри [тут](install.md)). 
## Приложение
Входной точкой является объект класса Application, рекомендуется пользоваться [так](../../client/js/main.js).

### Конфигурация
* routing 
    * Описание: смотри [Маршрутизация](#маршрутизация)
    * Тип: [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
* controllers 
    * Описание: смотри [Контроллер](#контроллер)
    * Тип: [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
* useLocalStorage 
    * Описание: Если указано true - будет кешеровать View в [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
    * Тип: [Bool](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)
* useSockets 
    * Описание: Если указано true - будут использованы веб-сокеты
    * Тип: [Bool](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)
* socketsURL
    * Описание: Адрес сервера
    * Тип: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
* firstLoadElementId
    * Описание: Елемент, который будет отображаться __до__ полной загрузки приложения
    * Тип: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

### Описание Функционала
* onStartApp
* onSocketConnected
* onSocketDisconnected
* getController
* changePath
* show404
* onPageChange
* Свойства:
    * searchParams
    * slugData

Пример:
```javascript
window.addEventListener('load', () => {
    class MyApp extends Application {
        onStartApp() {
            
        }

        onSocketConnected() {
            this.socket.on('complete', data => {
                this.getController('exampleController').setItems(data);
            });


            this.socket.on('delete', data => {
                this.getController('exampleController').setItems(data);
            });


            this.socket.on('create', data => {
                this.getController('exampleController').setItems(data);
            });

            this.socket.emit('getAll', {});
            this.socket.on('getAll', data => {
                this.getController('exampleController').setItems(data);
            });
        }
    }

    globalThis.app = new MyApp({
        useSockets: true,
        useLocalStorage: true,
        socketsURL: 'ws://localhost:3030',
        routing: {
            '/': 'exampleController',
        },
        controllers: [
            {
                name: 'exampleController', 
                url: '/js/controllers/exampleController.js', 
                settings: {
                    id: 'example',
                    url: '/views/example/index.json',
                    onError: '<div style="color: red">Error</div>',
                    showOnLoad: true
                }
            },
        ]
    });
});
```

## View
Для компиляции всех html файлов в json выполните команду в директории client/:
```
node compileViews.js 
```
### Описание Функционала
* if 
```html
    {i:условие:
        ...какой-то код
    :!}
```

* if-else
```html
    {i:условие:
        ...какой-то код
        :
        ...какой-то код
    :!}
```

* for
```html
    {f:массив/обьект:имя во время итерации:
        
    :!}
```

* include
```html
    {include файл.html}
```

* Переменные:
    * вставить переменую в шаблон
    ```html
        {{переменая}}
    ```
    * Ссылка на Контроллер
    ```html
        _this
    ```
    * Индекс итерации (только внутри for цикла)
    ```html
        _loopIndex
    ```

## Контроллер

## Маршрутизация