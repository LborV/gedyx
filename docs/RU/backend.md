# Бэкенд

Бэкенд состоит из трёх основных частей: 
* [Модели](#модели) - представляют гибкий интерфейс для общения с базой данных
* [Middlewares](#middlewares) - служат для валидации/модофикации информации во время общения с клиентом
* [Action](#action) - выполняют вашу бизнес логику приложения

## Модели

Любая Модель является дочерним классом от [QueryBuilder](../../server/kernel/queryBuilder/QueryBuilder.js) и предоставляет универсальный интерфейс для работы с разными базами данных

> На данный момент реализована только MySQL база

### MysqlQueryBuilder

Для создания модели достаточно в директории server/ выполнить следующую команду
```
npm run models {названия моделей}
```

> Можно передавать множество названий, перечисляя их через пробел

В качестве аргументов следует передавать названия таблиц в базе данных, на пример:

Если таблица
```SQL
CREATE TABLE todos(
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `text` VARCHAR (255) NULL,
    `status` ENUM('active', 'complete', 'deleted') NOT NULL
);
```
Тогда
```
npm run models todos
```

Это создаст файл [todos.js](../../server/models/todos.js) в папке server/models/
```javascript
const MysqlQueryBuilder = require('../kernel/queryBuilder/MysqlQueryBuilder');    
class todos extends MysqlQueryBuilder {
    ...
}

let obj = new todos({
    connection: mysqlConnection,
    table: 'todos'
});
module.exports = obj;
```

todos обьект будет создан автоматически при запуске приложения и доступен глобально

### Описание Функционала
MysqlQueryBuilder реализует текучий интерфейс для построения запросов к базе данных. Пример:
```javascript
this
    .selectRaw('*')
    .orderByDesc('id')
    .execute();
```

Для того чтобы получить результат запроса вызовите
```javascript
this.execute();
```

Для запуска произвольного SQL кода 
```javascript
this.executeRaw('SELECT * FROM `todos`');
```

Для того чтобы получить SQL код
```javascript
this.getSql();
```

Далее описаны доступные методы:
* delete 
    * Описание: удаляет запись/записи
    * Аргументы: 
    * Возвращает: указатель на объект
    * Пример
    ```javascript
        this.delete()
        // DELETE FROM 
    ```
* update
    * Описание: обновляет запись/записи
    * Аргументы: 
        * [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    * Возвращает: указатель на объект
    * Пример
    ```javascript
        this.update({
            id: 1
        })
        // UPDATE {tableName} SET `id` = 1 
    ```
* insert
    * Описание: вставляет запись/записи
    * Аргументы: 
        * [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    * Возвращает: указатель на объект
    * Пример
    ```javascript
        this.insert({
            id: 1
        })
        // INSERT {tableName} (`id`) VALUES (1) 
    ```
* select
    * Описание: определяет какие поля будут выбраны при запросе
    * Аргументы: 
        * ...[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
    * Возвращает: указатель на объект
    * Пример
    ```javascript
        this.select(
            'id',
            'status'
        );
        // SELECT `id`, `status`
    ```
* selectRaw
    * Описание: добавляет произвольный SQL в SELECT часть запроса
    * Аргументы: 
        * [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
    * Возвращает: указатель на объект
    * Пример
    ```javascript
        this.selectRaw('CONT(id)'); 
        // SELECT COUNT(id)
    ```
* where
    * Описание: добавляет елементы в часть WHERE в запросе
    * Возвращает: указатель на объект
    * Аргументы:
        * Один аргумент: 
            * Тип: [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
            * Пример
            ```javascript
                this.where((query) => {
                    return query
                        .where('id', 120)
                        .orWhere('id', 130);
                });
                // WHERE (`id` = 120 OR `id` = 130)
            ```
        * Два аргумента:
            * Тип первого аргумента: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
            * Тип второго аргумента: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) / [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
             * Пример
            ```javascript
                this.where('id', (query) => {
                    return query
                        .where('id', 120)
                        .orWhere('id', 130);
                });
                // WHERE `id` = (`id` = 120 OR `id` = 130)
            ```

            ```javascript
                this.where('id', 23);
                //WHERE `id` = 23
            ```
        * Три аргумента:
            * Второй аргмуент: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) / [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
            * Смотри предыдущий пункт

             * Пример
            ```javascript
                this.where('id', '<', (query) => {
                    return query
                        .where('id', 120)
                        .orWhere('id', 130);
                });
                // WHERE `id` <> (`id` = 120 OR `id` = 130)
            ```

            ```javascript
                this.where('id', '!=', 23);
                //WHERE `id` != 23
            ```
* orderBy
    * Описание: Сортирует по заданому полю
    * Аргументы: 
        * [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
    * Возвращает: указатель на объект
    * Пример
    ```javascript
        this.orderBy('id'); 
        // ORDER BY `id` ASC
    ```
* groupBy
    * Описание: Групирурет по заданому полю
    * Аргументы: 
        * [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
    * Возвращает: указатель на объект
    * Пример
    ```javascript
        this.groupBy('id'); 
        // GROUP BY `id`
    ```
* orderByDesc
    * Описание: Сортирует по заданому полю в обратном порядке
    * Аргументы: 
        * [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
    * Возвращает: указатель на объект
    * Пример
    ```javascript
        this.orderByDesc('id'); 
        // ORDER BY `id` DESC
    ```
* limit
    * Описание: Ограничивает количество получаемых записей
    * Аргументы: 
        * [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
    * Возвращает: указатель на объект
    * Пример
    ```javascript
        this.limit(10); 
        // LIMIT 10
    ```
* whereLike
    * Описание: Эквивалентно where с 3 аргументами 
    * Возвращает: указатель на объект
    ```javascript
        this.where(argument_1, 'LIKE', argument_2)
    ```
* orWhere
    * Описание: Эквивалентно where за исключением того, что вместо AND перед условие будет поставлено OR
    * Возвращает: указатель на объект
    * Пример:
    ```javascript
        this.orWhere('id', 1)
        // OR `id` = 1
    ```
* whereIn 
    * Описание: Проверяет, находится ли значение в выбраном массиве
    * Возвращает: указатель на объект
    * Аргументы:
        * [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
        * [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
    * Пример:
    ```javascript
        this.whereIn('id', [1, 2, 3])
        // `id` IN (1, 2, 3)
    ```
* whereNotIn 
    * Описание: Проверяет, __не__ находится ли значение в выбраном массиве
    * Возвращает: указатель на объект
    * Аргументы:
        * [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
        * [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
    * Пример:
    ```javascript
        this.whereNotIn('id', [1, 2, 3])
        // `id` NOT IN (1, 2, 3)
    ```
* whereNull
    * Описание: Проверяет, является ли значение NULL
    * Возвращает: указатель на объект
    * Аргументы:
        * [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
    * Пример:
    ```javascript
        this.whereNull('id')
        // `id` IS NULL
    ```
* whereNotNull
    * Описание: Проверяет, __не__ является ли значение NULL
    * Возвращает: указатель на объект
    * Аргументы:
        * [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
    * Пример:
    ```javascript
        this.whereNotNull('id')
        // `id` IS NOT NULL
    ```
* union
    * Описание:
    * Возвращает: указатель на объект
    * Аргументы:
        * [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    * Пример:
    ```javascript
        this.union((query) => {
            return query
                .table('testTable')
                .select('id')
                    .where('id', 10);
        })
    ```
* unionAll
    * Описание:
    * Возвращает: указатель на объект
    * Аргументы:
        * [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    * Пример:
    ```javascript
        this.unionAll((query) => {
            return query
                .table('testTable')
                .select('id')
                    .where('id', 10);
        })
    ```
* join
    * Описание: 
    * Возвращает: указатель на объект
    * Аргументы:
        * [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
        * [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    * Пример:
    ```javascript
        this.join('a', (query) => {
            return query
                .where('a.id', 1);
        });
        // JOIN `a` ON a.id = 1
    ```
* leftJoin
    * Описание: 
    * Возвращает: указатель на объект
    * Аргументы:
        * [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
        * [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    * Пример:
    ```javascript
        this.leftJoin('a', (query) => {
            return query
                .where('a.id', 1);
        });
        // LEFT JOIN `a` ON a.id = 1
    ```
* rightJoin
    * Описание: 
    * Возвращает: указатель на объект
    * Аргументы:
        * [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
        * [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    * Пример:
    ```javascript
        this.rightJoin('a', (query) => {
            return query
                .where('a.id', 1);
        });
        // RIGHT JOIN `a` ON a.id = 1
    ```
* innerJoin
    * Описание: 
    * Возвращает: указатель на объект
    * Аргументы:
        * [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
        * [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    * Пример:
    ```javascript
        this.innerJoin('a', (query) => {
            return query
                .where('a.id', 1);
        });
        // INNER JOIN `a` ON a.id = 1
    ```

## Action

Для создания Action достаточно в директории server/ выполнить следующую команду
```
npm run actions {названия}
```

> Можно передавать множество названий, перечисляя их через пробел

В качестве аргументов следует передавать названия Action, на пример:
```
npm run actions create
```

Это создаст файл [create.js](../../server/actions/create.js) в папке server/actions/
```javascript
var Action = require('../kernel/Action');

class create extends Action {
    request(data) {
       ...
    }
}

let obj = new create('create');
module.exports = obj;
```

Action create будет автоматически зарегестрирован при запуске приложения.

### Описание Функционала
Входной точкой для Action всегда является метод request. Аргумент, который принимает этот метод - полученый запрос. Для ответа существует несколько методов:
* response
    * Описание: возвращает клиенту ответ
    * Аргументы:
        * [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
* broadcast
    * Описание: возвращает всем подключеным клиентам ответ
    * Аргументы:
        * [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

> Не возвращать ответ - нормально.

Так же возможно симулировать запрос на другой Action при помощи метода:
* call
    * Аргументы:
        * [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) actionName
        * [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

## Middlewares
Middlewares нужны для того чтобы обрабатывать входяшие данные и выходящие. Самый простой пример использования - валидация данных. 


Для создания Middleware достаточно в директории server/ выполнить следующую команду
```
npm run middlewares {названия}
```

> Можно передавать множество названий, перечисляя их через пробел

В качестве аргументов следует передавать названия Middleware, на пример:
```
npm run middlewares validateID
```

Это создаст файл [validateID.js](../../server/middlewares/validateID.js) в папке server/middlewares/


```javascript
var Middleware = require('../kernel/Middleware');

class validateID extends Middleware {
    beforeRequest(data) {
        return data;
    }

    afterRequest(data) {
        return data;
    }
}

let obj = new validateID();
module.exports = obj;
```

Для того чтобы применить Middleware к Action нужно указать её название в конструкторе Action
```javascript
let obj = new deleteAction('delete', [validateID], [validateID]);
```
> Middlewares будут вызваны в том порядка, в каком они указаны в массиве, каждая Middleware возвращает результат следующей

В данном примере до вызова метода request у Action будет вызван метод beforeRequest, то что он вернёт - будет передано в request. В случае если Action будет возвращать результат - будет вызван метод afterRequest