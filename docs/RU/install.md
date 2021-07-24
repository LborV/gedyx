# Установка

## Требования
Для установки требуется 
* [Node js v14+](https://nodejs.org/en/download/)
* [MariaDb v8+](https://mariadb.org/download/)
* [NGINX](https://www.nginx.com/resources/wiki/start/topics/tutorials/install/)

## Конфигурация
В файле [configs.js](../server/configs.js) находятся конфигруации бэкенда.
Объект ```configs``` является JSON объектом, далее описаны поля ожидаемые по умолчанию:
* __mysql__ 
    * __host__ хост адресс вашего MySQL сервера
    * __user__ имя пользователя MySQL сервера
    * __password__ пароль пользователя MySQL сервера
    * __db__ 
* __socket__
    * __port__ порт подключения сокетов

> Рекомендуется для Фронтенда использовать NGINX, пример конфигруции можно постомотреть [здесь](../docker/nginx/nginx.conf), за более подробной информацией можно обратится к [документации NGINX](https://nginx.org/en/docs/)

## Установка
Для начала перейдите в директорию ./server
```
cd server/
```

затем выполните команду 
```
npm install
```

она установит все необходимые зависимости. Для того чтобы пересобрать Фронтенд перейдите в директорию ./client
```
cd client/
```

и выполните команду
```
node compileViews.js
```
[Принципы работы :arrow_right:](workflow.md)