import './scss/styles.scss';
import {cloneTemplate, createElement, ensureElement} from "./utils/utils";
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import { ShopAPI } from './components/ShopAPI';
import { BasketItemsView, BasketModel, BasketView, CatalogModel, IProduct } from './types';
import {Page} from "./components/Page";
import { AppState, CatalogChangeEvent } from './components/AppData';
import { Card } from './components/Card';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
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
const basket = new Basket(cloneTemplate(basketTemplate), events);
const appData = new AppState({}, events)

events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

events.on('basket:open', () => {
    modal.render({
        content: createElement<HTMLElement>('div', {}, [
            basket.render()
        ])
    });
});



//events.on('basket:change', (event: { items: string[] }) => {
//    basket.renderBasket(event.items);
//});

//const order = new Order(cloneTemplate(orderTemplate), events);

//events.on('basket:change', (event: {items: string[]}) => {
//    getBasketItems(event.items);
//})

//events.on('ui:basket-add', (event: {id: string[]}) => {
//    basket.renderBasket(event.id);
//})

//events.on('ui:basket-remove', (event: {id: string[]}) => {
//   basket.renderBasket(event.id);
//})


events.on<CatalogChangeEvent>('items:changed', () => {
    page.catalog = appData.catalog.map(item => {
        const card = new Card(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        
        });
        return card.render({
            title: item.title,
            image: item.image,
            // description: item.description,
            price: item.price,
            category: item.category
            
        })
    });
    
})


events.on('card:select', (item: IProduct) => {
    const card = new Card(cloneTemplate(cardPreviewTemplate));
    modal.render({
        content: card.render({
            title: item.title,
            image: item.image,
            description: item.description.split("\n"),
            price:item.price,
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




// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});

//events.on('card:select', (item: IProduct) => {
//    appData.setPreview(item);
//});

api.getCatalog()
.then(appData.setCatalog.bind(appData))
.catch(err => console.error(err))
