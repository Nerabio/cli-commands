# template-node-cli

template

```
src/
├── commands/
│ ├── add-file.command.ts # Команда для добавления одного файла
│ ├── core/
│ │ ├── command.decorator.ts # Декоратор для регистрации команд
│ │ ├── command.factory.ts # Фабрика для создания команд
│ │ └── command.registry.ts # Реестр зарегистрированных команд
│ ├── directory.command.ts # Команда для обработки всей директории
│ └── index.ts # Индекс-файл для экспорта команд
├── container.ts # Контейнер для инъекций зависимостей
├── interfaces/
│ ├── command-factory.interface.ts # Интерфейс фабрики команд
│ ├── command.interface.ts # Интерфейс команды
│ ├── config-app.interface.ts # Интерфейс конфигурации приложения
│ ├── index.ts # Индекс-файл для экспорта интерфейсов
│ ├── json-scheme.interface.ts # Интерфейс схемы JSON
│ ├── validation-error.interface.ts# Интерфейс ошибок валидации
│ ├── validation-result.interface.ts# Интерфейс результата валидации
│ └── validation-rule.interface.ts # Интерфейс правил валидации
├── procedures/
│ ├── create-checksum.function.ts # Функция для создания контрольной суммы
│ ├── extract-exports.function.ts # Процедура выделения экспортируемых сущностей
│ ├── extract-imports.function.ts # Процедура выделения импортируемых модулей
│ ├── file-processing-state.ts # Класс состояния обработки файла
│ ├── index.ts # Индекс-файл процедур
│ ├── process-file.ts # Основная процедура обработки файла
│ ├── remove-empty-lines.function.ts# Удаление пустых строк
│ ├── remove-lines-with-word.function.ts# Удаление строк с определенным словом
│ ├── replace-comments.function.ts # Замена комментариев
│ └── procedure-handler.interface.ts# Интерфейс обработчика процедур
├── services/
│ └── config.service.ts # Сервис для работы с конфигурацией
├── utils/
│ ├── greet.ts # Утилита приветствия
│ ├── save-to-json.ts # Сохраняет результат в JSON
│ ├── snake-to-camel.ts # Конвертер имен переменных из snake_case в camelCase
│ └── source-files-collector.ts # Коллектор файлов из директорий
├── validations/
│ ├── core/
│ │ ├── composite-rule.ts # Составное правило валидации
│ │ ├── validate.decorator.ts # Декоратор для валидации
│ │ └── validation.error.ts # Классы ошибок валидации
│ ├── file-exists-rule.validator.ts# Проверка существования файла
│ ├── file-extension-rule.validator.ts# Проверка допустимых расширений
│ ├── index.ts # Индекс-файл для экспортирования правил
│ └── is-directory-rule.validator.ts# Проверка является ли путь директорией
├── index.ts # Точка входа приложения
```

Основные компоненты:
Команды (commands/): Определяют конкретные операции, доступные приложению, такие как добавление файла или сканирование директории.
Интерфейсы (interfaces/): Описывают контракт для команд, сервисов и моделей данных.
Процедуры (procedures/): Предоставляют инструменты для обработки файлов, начиная от простого удаления пустых строк и заканчивая созданием контрольных сумм.
Сервисы (services/): Организуют сервисные методы, такие как работа с конфигурациями приложений.
Утилиты (utils/): Вспомогательные функции вроде конвертации имен переменных или сохранения результатов в JSON.
Валидация (validations/): Набор правил и механизмов для проверки правильности вводимых данных.
Такая архитектура позволяет эффективно управлять сложностью проектов Node.js и TypeScript, обеспечивает гибкость и простоту масштабирования.
