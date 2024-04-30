# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Описание базовых классов и компонентов

«Класс EventEmitter обеспечивает работу событий. Его функции: возможность установить и снять слушателей событий, вызвать слушателей при возникновении события».

«Компонент IPage Interface:
Представляет собой интерфейс страницы со счетчиком (количество товаров в корзине) и списком HTML-элементов».

«Компонент IOrderForm Interface:
Представляет собой форму для оформления заказа с полями электронной почты, телефона и адреса».

«Компонент IOrder Interface:
Расширяет интерфейс IOrderForm и добавляет элементы для заказа».

«Компонент IBasketModel Interface:
Представляет собой модель управления товарами в корзине».

«Класс BasketModel:
Реализует интерфейс IBasketModel для управления товарами в корзине».

«Компонент IProduct Interface:
Представляет продукт с его идентификатором, названием, стоимостью и необязательным описанием».

«Компонент ICatalogModel Interface:
Представляет собой модель для управления товарами в каталоге».

«Класс CatalogModel:
Реализует интерфейс ICatalogModel для управления товарами в каталоге».

«Компонент IViewConstructor Interface:
Представляет конструктор отображения с контейнером и дополнительными событиями».

«Компонент IView Interface:
Представляет конструктор отображения с методом преобразования данных в элементы HTML».

«Компонент BasketItemsView Class:
Реализует интерфейс IView для отображения элементов корзины с кнопками добавления и удалениясв».



