# Проектная работа "Веб-ларек"

MVP интернет-магазина с каталогом, корзиной и оформлением заказа.
<img width="537" alt="WebLarek" src="https://github.com/user-attachments/assets/add32bb6-4956-4463-9a0f-fa37f4d2ef00" />

**Стек:** HTML, SCSS, TS, Webpack

**Структура проекта:**

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом
- src/common.blocks/ - файлы стилей для блоков
- src/images/ - изображения
- src/pages/ - файлы html
- src/scss/ - общие файлы стилей
- src/vendor/ - сторонние пакеты
- src/types/ - типы, используемые приложением

**Важные файлы:**

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Что сделала

1. Спроектировала и задокументировала архитектуру приложения на основе MVP-паттерна.
2. Создала интерфейсы для API-клиента, моделей данных и компонентов отображения.
3. Реализовала базовые модели данных для взаимодействия с сервером, включая преобразование данных из формата API в формат для отображения.
4. Настроила модальные окна для отображения деталей товаров, работы с корзиной и оформления заказа, обеспечив их закрытие при взаимодействии с кнопками или вне окна.
5. Обеспечила валидацию пользовательского ввода на всех этапах оформления заказа (адрес доставки, контактные данные).
6. Настроила управление состояниями экранов, используя брокер событий для связи между данными и компонентами.
7. Реализовала интерактивное обновление отображения корзины при добавлении и удалении товаров.
8. Интегрировала приложение с сервером, обеспечив получение и отправку данных через API.

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

### Типы и Интерфейсы

`PaymentMethod`
**Описание:** Тип, представляющий методы оплаты в системе.
**Типы:** 'card' | 'cash'

`IOrderForm`
**Описание:** Интерфейс формы заказа, содержащий информацию для выполнения заказа.
**Свойства:**
_payment:_ PaymentMethod - метод оплаты.
_email:_ string - электронная почта клиента.
_phone:_ string - телефонный номер клиента.
_address:_ string - адрес доставки.
_total:_ number - общая сумма заказа.

`IOrderResult`
**Описание:** Интерфейс результата заказа.
**Свойства:**
_id:_ string - уникальный идентификатор заказа.

`IOrder`
**Описание:** Интерфейс заказа, расширяющий IOrderForm добавлением списка товаров.
**Свойства:**
_items:_ IProduct[] - массив товаров в заказе.

`OrderId`
**Описание:** Тип, представляющий уникальный идентификатор заказа.
_Тип:_ string

`OrderTotal`
**Описание:** Тип, представляющий общую сумму заказа.
_Тип:_ number

SentOrder

**Описание:** Тип, представляющий отправленный заказ с идентификатором и общей суммой.
_Тип:_ { id: OrderId; total: OrderTotal }

`emptyOrder`
**Описание:** Функция для создания пустого заказа.
Возвращает: IOrder

`togglePaymentType`
**Описание:** Функция для переключения между типами оплаты.
**Параметры:**
_value:_ PaymentMethod - текущий метод оплаты.
Возвращает: PaymentMethod - следующий метод оплаты.

`IEventEmitter`
**Описание:** Интерфейс для объектов, способных генерировать события.
**Методы:**

```
emit(event: string, data: unknown): void` - метод для генерации событий.
```

`IProduct`
**Описание:** Интерфейс продукта в каталоге.
**Свойства:**
_id:_ string - уникальный идентификатор продукта.
_title:_ string - название продукта.
_price:_ number | null - цена продукта, может быть null.
_description?:_ string - описание продукта, необязательное поле.
_image:_ string - ссылка на изображение продукта.
_category:_ string - категория продукта.

`formatProductPrice`
**Описание:** Функция для форматирования цены продукта.
**Параметры:**
_price:_ IProduct['price'] - цена продукта.
Возвращает: string - отформатированная строка цены.

`IAppState`
**Описание:** Интерфейс состояния приложения.
**Свойства:**
_catalog:_ IProduct[] - каталог продуктов.
_basket:_ string[] - массив идентификаторов продуктов в корзине.
_preview:_ string | null - идентификатор продукта для предпросмотра, может быть null.
_order:_ IOrder | null - текущий заказ, может быть null.
_loading:_ boolean - флаг загрузки данных.

`FormErrors`
**Описание:** Тип для ошибок формы.
_Тип:_ Partial<Record<keyof IOrder, string>>

`Validation`
**Описание:** Тип для валидации данных.
**Тип:** { key: string; error: string }[]

---

### Модели

### **Model<T>**

**Описание**: Абстрактный базовый класс для моделей, позволяющий отличать модели от простых объектов с данными.

**Конструктор**:

- `constructor(data: Partial<T>, events: IEvents)`: Инициализирует модель с данными и событиями.

**Методы**:

- `emitChanges(event: string, payload?: object)`: Сообщает о изменениях в модели.

### AppState

**Описание:** Класс AppState управляет состоянием приложения, включая каталог продуктов, корзину, текущий заказ и ошибки формы.

**Наследование:** Model<IAppState>

**Свойства:**

_basket:_ IProduct[] - массив продуктов в корзине.
_catalog:_ IProduct[] - массив продуктов в каталоге.
_loading:_ boolean - флаг загрузки данных.
_order:_ IOrder - текущий заказ.
_preview:_ string | null - идентификатор продукта для предпросмотра.
_formErrors:_ FormErrors - объект с ошибками формы.

**Методы:**

`setCatalog(items: IProduct[]): void` - устанавливает каталог продуктов и извещает об изменении.
`setPreview(item: IProduct): void` - устанавливает предпросмотр продукта и извещает об изменении.
`setOrderField(field: keyof IOrder, value: string): void` - устанавливает значение поля заказа и извещает о готовности заказа, если он валиден.
`validateOrder(): boolean` - проверяет заказ на наличие ошибок и извещает об изменении ошибок формы.

### Сервис для работы с "API" Web Larek"

### **Api**

**Описание**: Класс для работы с API.

**Конструктор**:

- `constructor(baseUrl: string, options: RequestInit = {})`: Инициализирует экземпляр Api с базовым URL и настройками.

**Методы**:

- `handleResponse(response: Response): Promise<object>`: Обрабатывает ответ от сервера.
- `get(uri: string)`: Выполняет GET-запрос.
- `post(uri: string, data: object, method: ApiPostMethods = 'POST')`: Выполняет POST-запрос.

#### ShopAPI

**Описание:** Класс ShopAPI предоставляет методы для взаимодействия с API магазина, включая получение данных о продуктах и управление заказами.

**Наследование:** Api

**Свойства:**
`cdn: string`- базовый URL для CDN изображений.

Конструктор:
`constructor(cdn: string, baseUrl: string, options?: RequestInit):` Создает экземпляр ShopAPI с заданными параметрами.

**Методы:**

`getCardItem(id: string): Promise<IProduct>` - получает данные о продукте по идентификатору.
`getCatalog(): Promise<IProduct[]> - получает` каталог продуктов.
`orderCards(order: IOrder): Promise<SentOrder>` - отправляет заказ и возвращает результат.

### Тип "События приложения"

### **IEvents**

**Описание**: Интерфейс для работы с событиями в приложении.

**Методы**:

- `on<T extends object>(event: EventName, callback: (data: T) => void)`: Подписывается на событие.
- `emit<T extends object>(event: string, data?: T)`: Инициирует событие.
- `trigger<T extends object>(event: string, context?: Partial<T>)`: Создаёт триггер для события.

### **EventEmitter**

**Описание**: Реализация брокера событий.

**Конструктор**:

- `constructor()`: Инициализирует экземпляр EventEmitter.

**Методы**:

- `on<T extends object>(...)`: Устанавливает обработчик на событие.
- `off(eventName: EventName, callback: Subscriber)`: Снимает обработчик с события.
- `emit<T extends object>(...)`: Инициирует событие с данными.
- `onAll(callback: (event: EmitterEvent) => void)`: Подписывается на все события.
- `offAll()`: Сбрасывает все обработчики.
- `trigger<T extends object>(...)`: Создаёт коллбек-триггер для события.

---

### Вспомогательные функции и классы

#### **pascalToKebab**

**Описание**: Преобразует строки из PascalCase в kebab-case.
**Сигнатура**: `function pascalToKebab(value: string): string`

#### **isSelector**

**Описание**: Проверяет, является ли переданный аргумент строкой, которая может быть селектором.
**Сигнатура**: `function isSelector(x: any): x is string`

#### **isEmpty**

**Описание**: Проверяет, является ли значение `null` или `undefined`.
**Сигнатура**: `function isEmpty(value: any): boolean`

#### **formatNumber**

**Описание**: Форматирует число, добавляя разделители между группами цифр.
**Сигнатура**: `function formatNumber(x: number, sep = ' '): string`

#### **SelectorCollection**

**Описание**: Тип, представляющий коллекцию селекторов.
**Тип**: `string | NodeListOf<Element> | T[]`

#### **ensureAllElements**

**Описание**: Гарантирует, что все элементы, соответствующие селектору, будут найдены.
**Сигнатура**: `function ensureAllElements<T extends HTMLElement>(selectorElement: SelectorCollection<T>, context: HTMLElement = document as unknown as HTMLElement): T[]`

#### **SelectorElement**

**Описание**: Тип, представляющий одиночный элемент или селектор.
**Тип**: `T | string`

#### **ensureElement**

**Описание**: Гарантирует, что элемент, соответствующий селектору, будет найден.
**Сигнатура**: `function ensureElement<T extends HTMLElement>(selectorElement: SelectorElement<T>, context?: HTMLElement): T`

#### **cloneTemplate**

**Описание**: Клонирует содержимое HTML-шаблона.
**Сигнатура**: `function cloneTemplate<T extends HTMLElement>(query: string | HTMLTemplateElement): T`

#### **bem**

**Описание**: Генерирует имя и класс по методологии BEM.
**Сигнатура**: `function bem(block: string, element?: string, modifier?: string): { name: string, class: string }`

#### **getObjectProperties**

**Описание**: Возвращает имена свойств объекта, соответствующие фильтру.
**Сигнатура**: `function getObjectProperties(obj: object, filter?: (name: string, prop: PropertyDescriptor) => boolean): string[]`

#### **setElementData**

**Описание**: Устанавливает атрибуты данных элемента.
**Сигнатура**: `function setElementData<T extends Record<string, unknown> | object>(el: HTMLElement, data: T): void`

#### **getElementData**

**Описание**: Получает типизированные данные из атрибутов данных элемента.
**Сигнатура**: `function getElementData<T extends Record<string, unknown>>(el: HTMLElement, scheme: Record<string, Function>): T`

#### **isPlainObject**

**Описание**: Проверяет, является ли объект простым объектом.
**Сигнатура**: `function isPlainObject(obj: unknown): obj is object`

#### **isBoolean**

**Описание**: Проверяет, является ли значение булевым.
**Сигнатура**: `function isBoolean(v: unknown): v is boolean`

#### **createElement**

**Описание**: Создает DOM-элемент с заданными свойствами и дочерними элементами.
**Сигнатура**: `function createElement<T extends HTMLElement>(tagName: keyof HTMLElementTagNameMap, props?: Partial<Record<keyof T, string | boolean | object>>, children?: HTMLElement | HTMLElement[]): T`

---

### Компоненты

### Базовый компонент **Component<T>**

**Описание**: Абстрактный базовый класс для компонентов, предоставляющий инструментарий для работы с DOM.

**Конструктор**:

- `constructor(container: HTMLElement)`: Инициализирует компонент с контейнером.

**Методы**:

- `toggleClass(element: HTMLElement, className: string, force?: boolean)`: Переключает класс элемента.
- `setText(element: HTMLElement, value: unknown)`: Устанавливает текстовое содержимое элемента.
- `setDisabled(element: HTMLElement, state: boolean)`: Меняет статус блокировки элемента.
- `setHidden(element: HTMLElement)`: Скрывает элемент.
- `setVisible(element: HTMLElement)`: Показывает элемент.
- `setImage(element: HTMLImageElement, src: string, alt?: string)`: Устанавливает изображение с альтернативным текстом.
- `render(data?: Partial<T>): HTMLElement`: Рендерит корневой DOM-элемент компонента.

---

### Компонент для отображения "Заказа"

#### **OrderPaymentStepView**

**Наследуется от**: `Form<IOrderForm>`

**Описание**: Представление шага оплаты заказа, позволяет пользователю выбрать метод оплаты и ввести адрес доставки.

**Свойства**:

- `_buttonOnline`: HTMLButtonElement - кнопка для выбора онлайн-оплаты.
- `_buttonOnReceipt`: HTMLButtonElement - кнопка для выбора оплаты при получении.
- `_addressInput`: HTMLInputElement - поле ввода адреса доставки.

**Методы**:

- `constructor(container: HTMLFormElement, events: IEvents)`: Конструктор класса.
- `set payment(value: IOrderForm['payment'])`: Устанавливает активный метод оплаты.

---

#### **OrderUserContactsStep**

**Наследуется от**: `Form<IOrderForm>`

**Описание**: Представление шага контактной информации пользователя, позволяет ввести email и телефон.

**Свойства**:

- `_emailInput`: HTMLInputElement - поле ввода электронной почты.
- `_phoneNumberInput`: HTMLInputElement - поле ввода номера телефона.

**Методы**:

- `constructor(container: HTMLFormElement, events: IEvents)`: Конструктор класса.
- `set phone(value: string)`: Устанавливает номер телефона.
- `set email(value: string)`: Устанавливает электронную почту.

### Компонент для отоброжения "Страницы"

**Наследуется от**: `Component<IPage>`

**Описание**: Компонент страницы, управляет элементами страницы, такими как счетчик корзины, каталог и блокировка страницы.

**Свойства**:

- `_counter`: HTMLElement - элемент счетчика корзины.
- `_catalog`: HTMLElement - элемент каталога.
- `_wrapper`: HTMLElement - обертка страницы.
- `_basket`: HTMLElement - элемент корзины.

**Методы**:

- `constructor(container: HTMLElement, events: IEvents)`: Конструктор класса.
- `set counter(value: number)`: Устанавливает значение счетчика корзины.
- `set catalog(items: HTMLElement[])`: Заменяет элементы каталога.
- `set locked(value: boolean)`: Блокирует или разблокирует страницу.

### Компонент для отображения "Карточки товара"

#### **Card<T>**

**Наследуется от**: `Component<ICard<T>>`

**Описание**: Компонент карточки продукта, отображает информацию о продукте, такую как название, описание, изображение и цена.

**Свойства**:

- `_category`: HTMLSpanElement - элемент категории продукта.
- `_image`: HTMLImageElement - элемент изображения продукта.
- `_title`: HTMLTitleElement - элемент названия продукта.
- `_price`: HTMLSpanElement - элемент цены продукта.
- `_description`: HTMLElement - элемент описания продукта.
- `_addButton`: HTMLButtonElement - кнопка добавления в корзину.
- `events`: EventEmitter - менеджер событий.

**Методы**:

- `constructor(container: HTMLElement, actions?: IProductViewEvents)`: Конструктор класса.
- `render(model: ICard<T>)`: Рендерит модель карточки.
- `setData(data: IProduct)`: Устанавливает данные продукта.
- `set description(value: string | string[])`: Устанавливает описание продукта.
- `set id(value: string)`: Устанавливает идентификатор продукта.
- `set title(value: string)`: Устанавливает название продукта.
- `set image(value: string)`: Устанавливает изображение продукта.
- `set category(value: string)`: Устанавливает категорию продукта.
- `set price(value: string)`: Устанавливает цену продукта.
- `set categoryClass(value: string)`: Устанавливает класс категории продукта.

---

#### **FullProductView<T>**

**Наследуется от**: `Card<T>`

**Описание**: Полное представление продукта, расширяет базовую карточку дополнительными функциями и элементами управления.

**Методы**:

- `constructor(container: HTMLElement, actions?: Pick<ICardActions, 'toggleBasket'>)`: Конструктор класса.
- `set isInBasket(inBasket: boolean)`: Устанавливает, находится ли продукт в корзине.
- `set validation(value: ICard<T>['validation'])`: Устанавливает валидацию продукта.

---

#### **BasketCardView<T>**

**Наследуется от**: `Card<T>`

**Описание**: Представление карточки продукта в корзине, позволяет управлять продуктами в корзине.

**Методы**:

- `constructor(container: HTMLElement, events: Pick<ICardActions, 'onDeleteClick'>)`: Конструктор класса.
- `set itemIndex(value: number)`: Устанавливает индекс элемента в корзине.

### Компонент для отображения "Корзины"

#### **Basket**

**Наследуется от**: `Component<IBasketView>`

**Описание**: Компонент корзины, управляет отображением товаров в корзине, их общей стоимостью и валидацией.

**Свойства**:

- `_items`: HTMLElement - элемент списка товаров в корзине.
- `_total`: HTMLElement - элемент общей стоимости товаров.
- `_submitButton`: HTMLButtonElement - кнопка для начала оформления заказа.

**Методы**:

- `constructor(container: HTMLElement, events: IBasketViewEvents)`: Конструктор класса.
- `set items(items: HTMLElement[])`: Устанавливает элементы товаров в корзине.
- `set total(value: number)`: Устанавливает общую стоимость товаров.
- `set validation(value: Validation)`: Устанавливает валидацию для кнопки оформления заказа.
- `renderBasketItems(products: IProduct[], events: EventEmitter)`: Рендерит элементы товаров в корзине.

**Функции**:

- `formatTotalPrice(total: Basket['total']): string`: Форматирует общую стоимость товаров в корзине.

---

### Компонент "Форма"

#### **Form<T>**

**Наследуется от**: `Component<IFormState>`

**Описание**: Базовый класс формы, управляет валидацией и отображением ошибок.

**Свойства**:

- `_submit`: HTMLButtonElement - кнопка отправки формы.
- `_errors`: HTMLElement - элемент для отображения ошибок валидации.

**Методы**:

- `constructor(container: HTMLFormElement, events: IEvents)`: Конструктор класса.
- `onInputChange(field: keyof T, value: string)`: Обрабатывает изменения в полях ввода формы.
- `set errors(value: string)`: Устанавливает текст ошибок валидации.
- `set valid(value: boolean)`: Устанавливает состояние валидности формы, для обновления состояния кнопки.
- `render(state: Partial<T> & IFormState)`: Рендерит состояние формы с учетом валидности и ошибок.

### Компонент для отображения "Модального окна"

#### **Modal**

**Наследуется от**: `Component<IModalData>`

**Описание**: Компонент модального окна, управляет отображением и закрытием модального содержимого.

**Свойства**:

- `_closeButton`: HTMLButtonElement - кнопка для закрытия модального окна.
- `_content`: HTMLElement - контейнер для содержимого модального окна.

**Методы**:

- `constructor(container: HTMLElement, events: IEvents)`: Конструктор класса.
- `set content(value: HTMLElement)`: Заменяет содержимое модального окна.
- `open()`: Открывает модальное окно.
- `close()`: Закрывает модальное окно и очищает его содержимое.
- `render(data: IModalData): HTMLElement`: Рендерит модальное окно с данными и открывает его.

---

### Компонент "Успешное взавершение заказа"

#### **Success**

**Наследуется от**: `Component<ISuccess>`

**Описание**: Компонент успешного выполнения действия, отображает сообщение об успехе и управляет его закрытием.

**Свойства**:

- `_closeButton`: HTMLButtonElement - кнопка для закрытия сообщения об успехе.
- `_description`: HTMLElement - элемент для отображения описания успешно завершённого события.

**Методы**:

- `constructor(container: HTMLElement, events: ISuccessActions)`: Конструктор класса.
- `set description(value: string)`: Устанавливает текст описания для сообщения об успешном завершении заказа.

### Компоненты состояний

#### **BasketState**

**Описание**: Состояние корзины, управляет товарами в корзине.

**Методы**:

- `constructor()`: Инициализирует состояние корзины.
- `findItem(item: IProduct): number | undefined`: Находит товар в корзине.
- `addItem(item: IProduct)`: Добавляет товар в корзину.
- `removeItem(item: IProduct)`: Удаляет товар из корзины.
- `clear()`: Очищает корзину.
- `count(): number`: Возвращает количество товаров в корзине.
- `get items(): IProduct[]`: Возвращает товары в корзине.
- `get total(): number`: Возвращает общую стоимость товаров в корзине.

---

#### **OrderState**

**Описание**: Состояние заказа, управляет информацией о заказе.

**Методы**:

- `clear()`: Очищает информацию о заказе.
- `get value(): IOrder`: Возвращает текущее состояние заказа.
- `set value(value: IOrder)`: Устанавливает состояние заказа.
- `get isPaymentValidated(): boolean`: Проверяет валидность информации об оплате.
- `get isContactsValidated(): boolean`: Проверяет валидность контактной информации.
- `get payment(): IOrder['payment']`: Возвращает информацию об оплате.
- `set payment(value: IOrder['payment'])`: Устанавливает информацию об оплате.
- `get address(): IOrder['address']`: Возвращает адрес доставки.
- `set address(value: string)`: Устанавливает адрес доставки.
- `get email(): IOrder['email']`: Возвращает электронную почту.
- `set email(value: string)`: Устанавливает электронную почту.
- `get phone(): IOrder['phone']`: Возвращает телефон.
- `set phone(value: string)`: Устанавливает телефон.
- `get items(): IOrder['items']`: Возвращает товары в заказе.
- `set items(value: IOrder['items'])`: Устанавливает товары в заказе и общую стоимость.

---

## Основной модуль приложения

Может зависеть от модулей следующих слоев: модели, сервисы и UI-компоненты. Не зависит от API браузера.

`index.ts`

## Назначение файла

Файл `index.ts` является точкой входа в приложение. Он отвечает за инициализацию основных компонентов системы, установку связей между ними через события и запуск первоначальной загрузки данных.

## Основные действия файла

- Импорт стилей и утилит.
- Импорт констант и компонентов.
- Создание экземпляров основных классов и установка связей между ними.
- Подписка на события и определение реакций на них.
- Инициализация начального состояния приложения и загрузка каталога продуктов.

## Ключевые компоненты инициализируемые в файле

- `EventEmitter`: Управляет событиями в приложении.
- `ShopAPI`: Обеспечивает взаимодействие с внешним API для получения и отправки данных.
- `Page`: Управляет отображением элементов на странице.
- `Modal`: Управляет модальными окнами.
- `AppState`: Хранит и управляет состоянием приложения.
- `BasketState` и `OrderState`: Управляют состоянием корзины и заказа соответственно.

## Процесс работы файла

1. Импортируются необходимые стили, утилиты, константы и компоненты.
2. Создаются шаблоны для различных частей интерфейса.
3. Инициализируются основные компоненты системы и устанавливаются связи между ними.
4. Определяются реакции на события, такие как добавление товара в корзину или изменение данных заказа.
5. Запускается начальная загрузка каталога продуктов и устанавливается начальное состояние приложения.

## Взаимодействие компонентов

Компоненты взаимодействуют друг с другом через систему событий `EventEmitter`. Например, при добавлении товара в корзину, компонент `Card` генерирует событие, на которое подписан компонент `Basket`, и таким образом обновляется состояние корзины.

## Используемые данные

- `IProduct`: Тип данных, описывающий продукт.
- `IOrderForm`: Тип данных, описывающий форму заказа.
- `Validation`: Тип данных для валидации.
