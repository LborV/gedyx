<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

*   [Action][1]
    *   [Parameters][2]
    *   [setParent][3]
        *   [Parameters][4]
    *   [getName][5]
    *   [requestIn][6]
        *   [Parameters][7]
    *   [request][8]
        *   [Parameters][9]
    *   [response][10]
        *   [Parameters][11]
    *   [broadcast][12]
        *   [Parameters][13]
    *   [call][14]
        *   [Parameters][15]

## Action

Этот класс должны наследовать произвольные Action
Аргумент actionName обязателен, он будет использоваться как имя метода для входящий сообщений
2 и 3 аргументы должны быть обьектами созданными от дочерних классов классов Middleware

<pre><code>
socket.on(actionName) 
</code></pre>

И также при ответе

<pre><code>
socket.emit(actionName)
</code></pre>

### Parameters

*   `actionName` **[String][16]** 
*   `middlewaresBefore` **[Array][17]** Middleware'ы которые отработают до вызова метода request (optional, default `[]`)
*   `middlewaresAfter` **[Array][17]** Middleware'ы которые отработают перед отправкой данных (optional, default `[]`)

Returns **[Action][18]** 

### setParent

Этот метод вызывается автоматически

#### Parameters

*   `parent` **Actions** 

Returns **[Action][18]** 

### getName

Возвращает имя Action

Returns **[String][16]** 

### requestIn

Этот метод вызывается автоматически

#### Parameters

*   `data` **[Object][19]** 
*   `socket` **socket** 

### request

Этот метод нужно перегрузить в дочернем классе,
он будет вызван на вохдощий запрос

<pre><code>
socket.on(actionName) 
</code></pre>

#### Parameters

*   `data` **[Object][19]** 

### response

Этот метод применит Middleware'ы и сделает клиенту запрос вроде:

<pre><code>
socket.emit(actionName, data) 
</code></pre>

#### Parameters

*   `data` **[Object][19]** 

Returns **[Object][19]** данные после Middleware'ов

### broadcast

Отработает схоже с методом response, только получателем будут все подключеные клиенты

#### Parameters

*   `data` **[Object][19]** 

Returns **[Object][19]** данные после Middleware'ов

### call

Этот метод симулирует запрос клиента в другой Action

#### Parameters

*   `actionName` **[String][16]** 
*   `data` **[Object][19]** 

Returns **[Object][19]** 

[1]: #action

[2]: #parameters

[3]: #setparent

[4]: #parameters-1

[5]: #getname

[6]: #requestin

[7]: #parameters-2

[8]: #request

[9]: #parameters-3

[10]: #response

[11]: #parameters-4

[12]: #broadcast

[13]: #parameters-5

[14]: #call

[15]: #parameters-6

[16]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[17]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array

[18]: #action

[19]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object