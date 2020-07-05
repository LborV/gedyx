## Содержние:
- [Главная]()
- Бэкенд
    - [Миграции](server/migrations)
    - [Модель](server/models)
- Фронтенд

# Миграции

Для создания миграции используйте команду:
```
npm run migration
```

или для создания миграции с кастомным именем:
```
npm run migration имяМиграции
```

> Используйте camelStyle для названия ваших таблиц

После успешного выполнения в папке migrations появится новый файл с подобным содержимым
```
//This file was automaticaly generated
//Feel free to edit :)
var config = require('../configs/config.js');
var migration = require('../kernel/migration.js');

var _migration = new migration({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.db,
}, true);

_migration.migrate([
    {table: '', drop: false, name: '', type: ''}
]);
```

Это и есть вами созданная миграция, обычно изменения стоит вносить только в
```
_migration.migrate([
    {table: '', drop: false, name: '', type: ''}
]);
```

> Миграция выполняется только один раз, отслеживается это в вашей базе данных в таблице **migrations**

***_migration.migrate()*** принимает массив объектов в качестве аргумента.
Объекты должны быть следующего вида:
```
table: название таблицы в которой будут внесены изменения
drop: если значение true, от таблица будет удалена
name: название колонки которую нужно изменить/создать
type: тип колоник
action: по умолчанию ADD COLUMN, для изменения типа или чего-то другого указываем соотвествующие SQL команды
```

> Если табица не существует в базе, она будет создана автоматически.
> Поле id будет созданно автоматически как Primary Key и Auto Increment

Например:
```
 {table: 'test', drop: false, name: 'myColumn', type: 'text'}
```

Это создаст таблицу test, если она не существовала и добавит колонку myColumn с типом данных text

Например:
```
 {table: 'test', drop: false, name: 'myColumn', type: 'int', action: 'MODIFY COLUMN'}
```

Это изменит тип нашей колонки на int

Например:
```
 {table: 'test', drop: true}
```

Эта команда удалит всю таблицу