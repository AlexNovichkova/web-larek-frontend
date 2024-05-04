import { IProduct } from "../types";
import {Component} from "./base/Component";
import { EventEmitter } from "./base/events";


interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard<T> {
    title: string;
    description?: string | string[];
    button?:HTMLButtonElement;
    image: string;
    category:string;
    price:string;
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

    constructor(container: HTMLElement, actions?: ICardActions) {
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

        if (this._addButton){
            this._addButton.addEventListener('click', () =>{
                this.events.emit('ui:basket-add', {id: this.id});
            })
        }
        
        

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
        this.setImage(this._image, value, this.title)
    }
    set category(value: string) {
        this.setText(this._category, value)
    }

    set price(value: string) {
        this.setText(this._price, value + ' синапсов')
    }

    get price(): string {
        return this._price.textContent || ''
    }

    
}





