
interface IPage {
    counter: number;
    catalog: HTMLElement[];
}

export interface IOrderForm {
    email: string;
    phone: string;
    address:string;
}

export interface IOrder extends IOrderForm {
    items: string[]
}
export interface IOrderResult {
    id: string;
}

export interface IBasketModel {
    items: Map<string, number>;
    add(id: string):void;
    remove(id: string):void;
}

export interface IEventEmitter {
    emit : (event: string, data : unknown) => void;
}

export class BasketModel implements IBasketModel {
    constructor(protected events: IEventEmitter){}

    items: Map<string, number> = new Map();
    add(id: string):void {
        if (!this.items.has(id)){
            this.items.set(id, 0);
        } else {
            this.items.set(id, this.items.get(id)! + 1);;
        }
        this._changed();
        
    }
    remove(id: string): void {
        if (!this.items.has(id)){
            return;
        }
        if (this.items.get(id) > 0){
            this.items.set(id, this.items.get(id)! - 1);
            if (this.items.get(id) === 0){
                this.items.delete(id);
            }
        }
        this._changed();
    }

    protected _changed(){
        this.events.emit('basket:change', {items: Array.from(this.items.keys())});
    }
}

export interface IProduct {
    id: string;
    title: string;
    cost: string;
    description?: string;
}

export interface ICatalogModel {
    items: IProduct[];
    setItems(items: IProduct[]):void;
    getProduct(id: string) :IProduct;
}

export class CatalogModel implements ICatalogModel {
    items: IProduct[] = [];
    
   
    setItems(items: IProduct[]): void {
        this.items = items;
    }
    
    getProduct(id: string): IProduct {
        return this.items.find(item => item.id === id)!;
    }
}

export interface IViewConstructor {
    new (container: HTMLElement, events?: IEventEmitter):IView;
}

export interface IView {
    render(data?: object): HTMLElement;
}

export class BasketItemsView implements IView {
    protected title: HTMLSpanElement;
    protected addButton: HTMLButtonElement;
    protected removeButton: HTMLButtonElement;

    protected id: string | null;

    constructor(protected container: HTMLElement, protected events: IEventEmitter){
        this.title = container.querySelector('.basket-item__title') as HTMLSpanElement;
        this.addButton = container.querySelector('.basket-item__add') as HTMLButtonElement;
        this.removeButton = container.querySelector('.basket-item__remove') as HTMLButtonElement;

        this.addButton.addEventListener('click', () =>{
            this.events.emit('ui:basket-add', {id: this.id});
        })

        this.removeButton.addEventListener('click', () =>{
            this.events.emit('ui:basket-remove', {id: this.id});
        })
    }

    render(data: {id: string, title: string}) {
        if (data){
            this.id = data.id;
            this.title.textContent = data.title;
        }
        return this.container;
    }
}

export class BasketView implements IView {
    constructor(protected container: HTMLElement) {}
    render(data: {items: HTMLElement[]})  {
        if (data) {
            this.container.replaceChildren(...data.items);
        }
        return this.container;
    }
}


export interface IAppState {
    catalog: IProduct[];
    basket: string[];
    preview: string | null;
    order: IOrder | null;
    loading: boolean;
}
