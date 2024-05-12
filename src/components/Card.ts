import { IProduct, Validation } from "../types";
import {Component} from "./base/Component";
import { EventEmitter } from "./base/Events";

export const categories: Record<string, string> = {
	'софт-скил': 'soft',
	другое: 'other',
	дополнительное: 'additional',
	кнопка: 'button',
	'хард-скил': 'hard',
};


interface ICardActions {
    toggleBasket: () => void;
	onDeleteClick: () => void;
}

interface IProductViewEvents {
    onClick: (event: MouseEvent) => void;
}


export interface ICard<T> {
    title: string;
    description?: string | string[];
    button?:HTMLButtonElement;
    image: string;
    category:string;
    price:string;
    categoryClass: string;
    itemIndex?: number;
    validation?: Validation;
    isInBasket?: boolean;
}

export class Card<T> extends Component<ICard<T>> {
    protected _category: HTMLSpanElement;
    protected _image: HTMLImageElement;
    protected _title: HTMLTitleElement;
    protected _price: HTMLSpanElement;
    protected _description?: HTMLElement;
    protected _addButton? : HTMLButtonElement;
    protected events : EventEmitter;
   
    
    
    setData(data: IProduct) {
        this.title = data.title;
        this.image = data.image;
        this.description = data.description ? data.description : ''; 
    }

    constructor(container: HTMLElement, actions?: IProductViewEvents) {
        super(container);

        this.events = new EventEmitter();

        this._category = container.querySelector(`.card__category`);
        this._title = container.querySelector(`.card__title`);
        this._image = container.querySelector(`.card__image`);
        this._price = container.querySelector(`.card__price`);
        this._description = container.querySelector('.card__text');
        this._addButton = container.querySelector(`.card__button`);
        
        if (actions?.onClick) {
            container.addEventListener('click', actions.onClick);
        }

    
    }
    
    render(model: ICard<T>) {
        super.render(model);
        return this.container
        
    }

    set description(value: string | string[]) {
        if (Array.isArray(value)) {
            this._description.replaceWith(...value.map(str => {
                const descTemplate = this._description.cloneNode() as HTMLElement;
                this.setText(descTemplate, str);
                return descTemplate;
            }));
        } else {
            this.setText(this._description, value);
        }
    }
    

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }
    set image(value: string) {
		this._image && this.setImage(this._image, value);
	}
    
    set category(value: string) {
        this.setText(this._category, value)
    }

    set price(value: string) {
        this._price && this.setText(this._price, value);
    }

    get price(): string {
        return this._price.textContent || ''
    }

    set categoryClass(value: string) {
		if (this._category) {
			this._category.classList.forEach(
				(x) =>
					x.startsWith('card__category_') && this.toggleClass(this._category, x, false)
			);
			this.toggleClass(this._category, `card__category_${value}`, true);
		}
	}

    
}

export class FullProductView<T> extends Card<T> {
	protected _description: HTMLElement;
	protected _toBasketButton: HTMLButtonElement;
    

	constructor(container: HTMLElement, actions?: Pick<ICardActions, 'toggleBasket'>) {
		super(container);

		
		this._image = container.querySelector(`.card__image`);
		this._description = container.querySelector('.card__text');
		this._toBasketButton = container.querySelector('.button');

		if (actions?.toggleBasket) {
            this._toBasketButton.addEventListener('click', actions.toggleBasket);
        }
        
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set isInBasket(inBasket: boolean) {
		this.setText(this._toBasketButton, inBasket ? 'Убрать' : 'В корзину');
	}

	set validation(value: ICard<T>['validation']) {
		if (value.length != 0) {
			this.setDisabled(this._toBasketButton, true);
			this._toBasketButton.setAttribute(
				'title',
				value.map((x) => x.error).join('; ')
			);
		} else {
			this.setDisabled(this._toBasketButton, false);
			this._toBasketButton.setAttribute('title', '');
		}
	}
    
}

export class BasketCardView<T> extends Card<T> {
    protected _itemIndex: HTMLSpanElement;
    protected _deleteFromBasketButton: HTMLButtonElement;
    

    constructor(container: HTMLElement, events: Pick<ICardActions, 'onDeleteClick'>) {
        super(container);

        this._itemIndex = container.querySelector('.basket__item-index');
        this._deleteFromBasketButton = container.querySelector('.basket__item-delete');
        

        if (this._deleteFromBasketButton) {
            this._deleteFromBasketButton.addEventListener('click', () => {
                events.onDeleteClick();
            });
        }
    }

   
    set itemIndex(value: number) {
        this.setText(this._itemIndex, value);
    }   


   
}





