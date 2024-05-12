import { IOrder, IProduct,  Validation, emptyOrder } from "../types";

export class BasketState{
	protected _value: { items: IProduct[] };
	

	constructor() {
		this._value = { items: [] };
	}

	findItem(item: IProduct): number | undefined {
		const res = this._value.items.findIndex((value) => value.id === item.id);
		return res === -1 ? undefined : res;
	}
	

	addItem(item: IProduct) {
		this._value.items.push(item);
	}

	removeItem(item: IProduct) {
		this._value.items = this._value.items.filter((x) => x.id !== item.id);
	}

	clear() {
		this._value.items = [];
	}

	count(): number {
		return this._value.items.length;
	}

	get items(): IProduct[] {
		return this._value.items;
	}

	get total(): number {
        return this._value.items.reduce((acc, x) => {
            // Убедимся, что x является объектом и имеет свойство price перед тем как обращаться к нему
            if (x && typeof x.price !== 'undefined') {
                return acc + Number(x.price);
            } else {
                
                return acc;
            }
        }, 0);
    }
}


export class OrderState {
	protected _value: IOrder = emptyOrder();
	protected _validation: Validation = [];

	clear() {
		this._value = emptyOrder();
	}

	
	get value(): IOrder {
		return this._value;
	}

	set value(value: IOrder) {
		this._value = value;
	}

	get isPaymentValidated(): boolean {
		return this._value.address.length > 0;
	}

	get isContactsValidated(): boolean {
		return this._value.email.length > 0 && this._value.phone.length > 0;
	}

	get payment(): IOrder['payment'] {
		return this._value.payment;
	}

	set payment(value: IOrder['payment']) {
		this._value.payment = value;
	}

	get address(): IOrder['address'] {
		return this._value.address;
	}

	set address(value: string) {
		this._value.address = value;
	}

	get email(): IOrder['email'] {
		return this._value.email;
	}

	set email(value: string) {
		this._value.email = value;
	}

	get phone(): IOrder['phone'] {
		return this._value.phone;
	}

	set phone(value: string) {
		this._value.phone = value;
	}

	get items(): IOrder['items'] {
		return this._value.items;
	}

	set items(value: IOrder['items']) {
		this._value.items = value;
		this._value.total = value.reduce((acc, x) => acc + Number(x.price || 0), 0);
	}
}
