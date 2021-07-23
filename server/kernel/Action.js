const Middleware = require('./Middleware');


/**
 * Этот класс должны наследовать произвольные Action
 * Аргумент actionName обязателен, он будет использоваться как имя метода для входящий сообщений 
 * 2 и 3 аргументы должны быть обьектами созданными от дочерних классов классов Middleware 
 * <pre><code>
 * socket.on(actionName) 
 * </code></pre>
 * 
 * И также при ответе
 * 
 * <pre><code>
 * socket.emit(actionName)
 * </code></pre>
 * 
 * @param {String} actionName 
 * @param {Array} middlewaresBefore Middleware'ы которые отработают до вызова метода request
 * @param {Array} middlewaresAfter Middleware'ы которые отработают перед отправкой данных
 * @returns {Action}
 */
class Action {
    constructor(actionName, middlewaresBefore = [], middlewaresAfter = []) {
        this.actionName = actionName;
        this.middlewaresBefore = middlewaresBefore;
        this.middlewaresAfter = middlewaresAfter;
        return this;
    }

    /**
     * 
     * Этот метод вызывается автоматически
     * @param {Actions} parent 
     * @returns {Action}
     */
    setParent(parent) {
        this.parent = parent;
        return this;
    }

    /**
     * 
     * Возвращает имя Action
     * @returns {String}
     */
    getName() {
        return this.actionName;
    }

    /**
     * Этот метод вызывается автоматически
     * @param {Object} data 
     * @param {socket} socket 
     */
    requestIn(data, socket) {
        this.socket = socket;
        
        this.middlewaresBefore.forEach(middleware => {
            if(!(middleware instanceof Middleware)) {
                throw 'Middleware should extend Middleware class!';
            }

            data = middleware.beforeRequest(data);
        });

        this.request(data);
    }

    /**
     * 
     * Этот метод нужно перегрузить в дочернем классе,
     * он будет вызван на вохдощий запрос
     * 
     * <pre><code>
     * socket.on(actionName) 
     * </code></pre>
     * @param {Object} data 
     */
    request(data) {
        console.log('Request method can be overwriten');
    }

    /**
     * 
     * Этот метод применит Middleware'ы и сделает клиенту запрос вроде:
     * <pre><code>
     * socket.emit(actionName, data) 
     * </code></pre>
     * 
     * @param {Object} data 
     * @returns {Object} данные после Middleware'ов 
     */
    response(data) {
        this.middlewaresAfter.forEach(middleware => {
            if(!(middleware instanceof Middleware)) {
                throw 'Middleware should extend Middleware class!';
            }

            data = middleware.afterRequest(data);
        });
        this.socket.emit(this.actionName, data);

        return data;
    }

    /**
     * 
     * Отработает схоже с методом response, только получателем будут все подключеные клиенты
     * @param {Object} data 
     * @returns {Object} данные после Middleware'ов 
     */
    broadcast(data) {
        data = this.response(data);
        this.socket.broadcast.emit(this.actionName, data);

        return data;
    }

    /**
     * 
     * Этот метод симулирует запрос клиента в другой Action
     * @param {String} actionName 
     * @param {Object} data 
     * @returns {Object}
     */
    call(actionName, data) {
        if(actionName === this.actionName) {
            return {};
        }
        return this.parent.call(actionName, data, this.socket);
    }
}

module.exports = Action;