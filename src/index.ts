import './scss/styles.scss';
import {cloneTemplate, ensureElement, isEmpty} from "./utils/utils";
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import { ShopAPI } from './components/ShopAPI';
import {IOrderForm, IProduct, formatProductPrice, Validation, togglePaymentType} from './types';
import {Page} from "./components/Page";
import { AppState, CatalogChangeEvent } from './components/AppData';
import { Card, FullProductView, categories } from './components/Card';
import { Modal } from './components/common/Modal';
import { Basket, formatTotalPrice } from './components/common/Basket';
import { BasketState, OrderState } from './components/base/state';
import { OrderPaymentStepView, OrderUserContactsStep } from './components/Order';
import { Success } from './components/common/Sucsess';
// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const events = new EventEmitter();
const api = new ShopAPI(CDN_URL, API_URL);
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const appData = new AppState({}, events)

const orderPaymentStepView = new OrderPaymentStepView(cloneTemplate(orderTemplate),events);
const orderContactsStepView = new OrderUserContactsStep(cloneTemplate(contactsTemplate),events);

const basketState = new BasketState();
const orderState = new OrderState();

events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

const basketView = new Basket(cloneTemplate(basketTemplate),{
	startOrder: () => {
		events.emit('basket_start_order', {
			items: basketState.items,
		});
	},
});



events.on('basket:open', () => {
    const validation: Validation =
        basketState.total === 0 
            ? [{ key: 'total', error: 'Итог по корзине равен нулю' }]
            : [];

    
    basketView.renderBasketItems(basketState.items, events);
    const content = basketView.render({
		
		total: formatTotalPrice(basketState.total),
		validation,
    });
    modal.render({ content });
});



events.on<{ item: IProduct }>('ui:basket-add', ({ item }) => {
    const itemIndex = basketState.findItem(item);
    if (itemIndex === undefined) {
        basketState.addItem(item);
    } else {
        basketState.removeItem(item);
    }
    page.render({ counter: basketState.count() });
});

events.on<{ product: IProduct; basketView: Basket }>(
	'ui:basket-remove',
	({ product, basketView }) => {
		basketState.removeItem(product);
        
		const validation: Validation =
			basketState.total === 0
				? [{ key: 'total', error: 'Итог по корзине равен нулю' }]
				: [];
		page.render({ counter: basketState.count() });
        basketView.renderBasketItems(basketState.items, events);
		modal.render({
            content: basketView.render({
                total: formatTotalPrice(basketState.total),
                validation,
            }),
        });
	}
);

events.on<CatalogChangeEvent>('items:changed', () => {
    page.catalog = appData.catalog.map(item => {
        const card = new Card(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        
        });
        return card.render({
            title: item.title,
            image: item.image,
            price: formatProductPrice(item.price),
            category: item.category,
            categoryClass: categories[item.category]
            
        })
    });
    
})


events.on('card:select', (item: IProduct) => {
    const card = new FullProductView(cloneTemplate(cardPreviewTemplate),{
		toggleBasket: () => {
			events.emit('ui:basket-add', { item });
			modal.close();
		}
    });
    const validation: Validation = isEmpty(item.price)
		? [{ key: 'price', error: 'Этот товар нельзя купить. Он бесценен!' }]
		: [];
    modal.render({
        content: card.render({
            title: item.title,
            image: item.image,
            description: item.description.split("\n"),
            price:formatProductPrice(item.price),
            category: item.category,
            isInBasket: basketState.findItem(item) !== undefined,
            validation,
            categoryClass: categories[item.category]
        })
    });
    if (item) {
        api.getCardItem(item.id)
            .then((result) => {
                item.description = result.description;
                card.setData(item); 
                modal.open();
            })
            .catch((err) => {
                console.error(err);
            });
    } else {
        modal.close();
    }
});


events.on<{ items: IProduct[] }>('basket_start_order', ({ items }) => {
	orderState.items = items;
    appData.order.items = orderState.items
    appData.order.total = orderState.value.total
	modal.render({
		content: orderPaymentStepView.render({
			payment: orderState.value.payment,
			valid: false,
            errors: [],
		}),
	});
});

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
    const { email, phone, address} = errors;
    orderContactsStepView.valid = !email && !phone;
    orderPaymentStepView.valid = !address;
    orderPaymentStepView.errors = Object.values({address}).filter(i => !!i).join('; ');
    orderContactsStepView.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

// Изменилось одно из полей
events.on(/^order\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
    appData.setOrderField(data.field, data.value);
    
});

events.on(/^contacts\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
    appData.setOrderField(data.field, data.value);
});


events.on('orderPaymentStepView:submit', () => { 
	modal.render({
		content: orderContactsStepView.render({
            phone: '',
            email: '',
            errors: [],
			valid: false,
		}),
	});
});


events.on('order_change_payment_type', () => {
	orderState.payment = togglePaymentType(orderState.value.payment);
	orderPaymentStepView.render({ payment: orderState.value.payment,
        errors: [],
     });
});



events.on('order:submit', () => {
    console.log('Отправляемый заказ:', appData.order);
    api.orderCards(appData.order)
        .then((result) => {
            basketState.clear();
		    orderState.clear();
            const success = new Success(cloneTemplate(successTemplate), {
                onClose: () => {
                    events.emit('success_close');
                }
            });

            modal.render({
                content: success.render({
                    description: `Списано ${formatProductPrice(result.total)}`
                })
            });
        })
        .catch(err => {
            console.error(err);
        });
});

events.on('success_close', () => {
	modal.close();
	page.render({ counter: basketState.count() });
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});


api.getCatalog()
.then(appData.setCatalog.bind(appData))
.catch(err => console.error(err))
