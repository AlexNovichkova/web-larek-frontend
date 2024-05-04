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
- src/scss/styles.scss — корневой файл стилей
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

## Архитектура

### Модели

Данный слой не зависит ни от каких частей приложения. Описывает модели данных, их интерфейсы и процедуры их преобразования

#### Товар:
```javascript

export interface IProduct {
    id: string;
    title: string;
    price: string;
    description?: string;
    image: string;
    category:string;
}
```


#### Заказ:

```javascript

export enum PaymentMethod {
    Cash = "Наличный",
    NonCash = "Безналичный",
}

export interface IOrderForm {
    address:string;
    paymentMethod: PaymentMethod;
}
```

## Приложение :
Модули и классы прикладного слоя могут использовать слой моделей и сервисный слой (сервисы и UI-компоненты приложения) Здесь происходит инициализация брокера событий, создание сервисов и UI-компонентов, начальная инициализация приложения; описываются требуемые для приложения интерфейсы взаимодействия с внешним миром
### Брокер событий
Обеспечивает работу событий. Его функции: возможность установить и снять слушателей событий, вызвать слушателей при возникновении события
Класс имеет методы on ,  off ,  emit  — для подписки на событие, отписки от события и уведомления
подписчиков о наступлении события соответственно.
Дополнительно реализованы методы  onAll и  offAll  — для подписки на все события и сброса всех
подписчиков.

```javascript


// Хорошая практика даже простые типы выносить в алиасы
// Зато когда захотите поменять это достаточно сделать в одном месте
type EventName = string | RegExp;
type Subscriber = Function;
type EmitterEvent = {
    eventName: string,
    data: unknown
};

export interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}

/**
 * Брокер событий, классическая реализация
 * В расширенных вариантах есть возможность подписаться на все события
 * или слушать события по шаблону например
 */
export class EventEmitter implements IEvents {
    _events: Map<EventName, Set<Subscriber>>;

    constructor() {
        this._events = new Map<EventName, Set<Subscriber>>();
    }

    /**
     * Установить обработчик на событие
     */
    on<T extends object>(eventName: EventName, callback: (event: T) => void) {
        if (!this._events.has(eventName)) {
            this._events.set(eventName, new Set<Subscriber>());
        }
        this._events.get(eventName)?.add(callback);
    }

    /**
     * Снять обработчик с события
     */
    off(eventName: EventName, callback: Subscriber) {
        if (this._events.has(eventName)) {
            this._events.get(eventName)!.delete(callback);
            if (this._events.get(eventName)?.size === 0) {
                this._events.delete(eventName);
            }
        }
    }

    /**
     * Инициировать событие с данными
     */
    emit<T extends object>(eventName: string, data?: T) {
        this._events.forEach((subscribers, name) => {
            if (name instanceof RegExp && name.test(eventName) || name === eventName) {
                subscribers.forEach(callback => callback(data));
            }
        });
    }

    /**
     * Слушать все события
     */
    onAll(callback: (event: EmitterEvent) => void) {
        this.on("*", callback);
    }

    /**
     * Сбросить все обработчики
     */
    offAll() {
        this._events = new Map<string, Set<Subscriber>>();
    }

    /**
     * Сделать коллбек триггер, генерирующий событие при вызове
     */
    trigger<T extends object>(eventName: string, context?: Partial<T>) {
        return (event: object = {}) => {
            this.emit(eventName, {
                ...(event || {}),
                ...(context || {})
            });
        };
    }
}
```


### Основной модуль приложения

`index.ts`
* точка входа в приложение
* создание сервисов и UI-компонентов приложения
* добавление событий в EventEmitter и подключение их обработчиков
* запуск получения товаров с сервера и заполнение компонента начальной страницы


### Интерфейсы взаимодействия с внешним миром 
Эти интерфейсы - часть приложения. Сервисы, которые будет использовать приложение, должны реализовать эти интерфейсы. Таким образом мы сможем при необходимости заменить их без изменения самого приложения

```javascript

export interface IShopAPI {
    getCardItem: (id: string) => Promise<IProduct>;
    getCatalog: () => Promise<IProduct[]>;
    getBasketItems: () => Promise<IProduct[]>;
    createOrder: (order: IOrderForm) => Promise<IOrderResult>;
}

```

### Интерфейсы UI-компонентов
Эти интерфейсы - часть приложения. Компоненты, которые будет вызывать приложение, должны соответствовать этим интерфейсам. 

```javascript

export interface IViewConstructor {
    new (container: HTMLElement, events?: IEventEmitter):IView;
}

export interface IView {
    render(data?: object): HTMLElement;
}
```

## Сервисы

Классы для взаимодействия приложения с внешним миром. Реализуют вышеуказанные интерфейсы.

### Сервис "API сервера Web Larek"

Назначение - взаимодействие с сервером

```javascript

export class ShopAPI extends Api implements IShopAPI {
    readonly cdn: string;
    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getCardItem(id: string): Promise<IProduct> {
        return this.get(`/product/${id}`).then(
            (item: IProduct) => ({
                ...item,
                image: this.cdn + item.image,
            })
        );
    }
    

    getCatalog(): Promise<IProduct[]> {
        return this.get('/product').then((data: ApiListResponse<IProduct>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    getBasketItems(): Promise<IProduct[]> {
        return this.get('/basket/items')
        .then((data: ApiListResponse<IProduct>) => data.items);
    }

    createOrder(order: IOrderForm): Promise<IOrderResult> {
        return this.post('/order', order)
        .then((data: IOrderResult) => data);
    }
}
```

## UI-компоненты

### Базовый компонент

Не зависит от приложения. Предоставляет метод render, который вызывает соответствующие переданному аргументу сеттеры дочернего компонента

```javascript

export abstract class Component<T> {
    protected constructor(protected readonly container: HTMLElement) {
        // Учитывайте что код в конструкторе исполняется ДО всех объявлений в дочернем классе
    }

    // Инструментарий для работы с DOM в дочерних компонентах

    // Переключить класс
    toggleClass(element: HTMLElement, className: string, force?: boolean) {
        element.classList.toggle(className, force);
    }

    // Установить текстовое содержимое
    protected setText(element: HTMLElement, value: unknown) {
        if (element) {
            element.textContent = String(value);
        }
    }

    // Сменить статус блокировки
    setDisabled(element: HTMLElement, state: boolean) {
        if (element) {
            if (state) element.setAttribute('disabled', 'disabled');
            else element.removeAttribute('disabled');
        }
    }

    // Скрыть
    protected setHidden(element: HTMLElement) {
        element.style.display = 'none';
    }

    // Показать
    protected setVisible(element: HTMLElement) {
        element.style.removeProperty('display');
    }

    // Установить изображение с алтернативным текстом
    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }

    // Вернуть корневой DOM-элемент
    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}
```