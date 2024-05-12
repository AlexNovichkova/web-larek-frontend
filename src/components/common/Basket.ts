import {Component} from "../base/Component";
import { ensureElement, cloneTemplate} from "../../utils/utils";
import { IProduct, Validation, formatProductPrice } from "../../types";
import { BasketCardView, categories} from "../Card";
import { EventEmitter } from "../base/events";


interface IBasketView {
    items: HTMLElement[];
    total: string;
    validation?: Validation;
}

interface IBasketViewEvents {
	startOrder: () => void;
}

export class Basket extends Component<IBasketView> {
    protected _items: HTMLElement;
    protected _total: HTMLElement;
    protected _submitButton: HTMLButtonElement;
	

    constructor(container: HTMLElement, events: IBasketViewEvents) {
        super(container);

        this._items = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = ensureElement<HTMLElement>('.basket__price', this.container);
        this._submitButton = ensureElement<HTMLButtonElement>('.basket__button',this.container);

        this._submitButton.addEventListener('click', () => {
			events.startOrder();
		});
        this.items = [];
    }

    set items(items: HTMLElement[]) {
		this._items.replaceChildren(...items);
	}

	set total(value: number) {
		this.setText(this._total, value);
	}

	set validation(value: Validation) {
		this.setDisabled(this._submitButton, value.length !== 0);
	}

    renderBasketItems(products: IProduct[], events: EventEmitter) {
        const items = products.map((product, index) => {
            const productCard = new BasketCardView(cloneTemplate(ensureElement<HTMLTemplateElement>('#card-basket')), {
                onDeleteClick: () => {
                    events.emit('ui:basket-remove', { product, basketView: this });
                    
                }
            });

            return productCard.render({
                ...product,
                price: formatProductPrice(product.price),
                categoryClass: categories[product.category],
                itemIndex: index + 1
            });
        });

        this.items = items;
    }

     
    
}

export function formatTotalPrice(total: Basket['total']): string {
    if (total === null || typeof total === 'undefined') {
        return 'Бесценно';
    } else {
        return total + ' синапсов';
    }
}

