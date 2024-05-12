
export type PaymentMethod = 'card' | 'cash';

export interface IOrderForm {
    payment: PaymentMethod;
	email: string;
	phone: string;
	address: string;
	total: number;
}

export interface IOrderResult {
    id: string;
}

export interface IOrder extends IOrderForm{
	items: IProduct[];
};

type OrderId = string;
type OrderTotal = number;

export type SentOrder = { id: OrderId; total: OrderTotal };

export function emptyOrder(): IOrder {
	return {
		payment: 'card',
		email: '',
		phone: '',
		address: '',
		total: 0,
		items: [],
	};
}

export function togglePaymentType(value: PaymentMethod): PaymentMethod {
	return value === 'card' ? 'cash' : 'card';
}

export interface IEventEmitter {
    emit : (event: string, data : unknown) => void;
}


export interface IProduct {
    id: string;
    title: string;
    price: number | null;
    description?: string;
    image: string;
    category:string;
}

export function formatProductPrice(price: IProduct['price']): string {
    if (price === null || typeof price === 'undefined') {
        return 'Бесценно';
    } else {
        return price + ' синапсов';
    }
}

export interface IAppState {
    catalog: IProduct[];
    basket: string[];
    preview: string | null;
    order: IOrder | null;
    loading: boolean;
}



export type FormErrors = Partial<Record<keyof IOrder, string>>;

export type Validation = { key: string; error: string }[];