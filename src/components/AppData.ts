

import {Model} from "./base/Model";
import {FormErrors, IAppState, IOrder,  IProduct} from "../types";

export type CatalogChangeEvent = {
    catalog: IProduct[]
};


export class AppState extends Model<IAppState> {
    basket: IProduct[];
    catalog: IProduct[];
    loading: boolean;
    order: IOrder = {
        payment: "card",
        email: '',
        phone: '',
        address: '',
        total: 0,
        items: [],
    };
    preview: string | null;
    formErrors: FormErrors = {};

    setCatalog(items: IProduct[]) {
        this.catalog = items;
        this.emitChanges('items:changed', { catalog: this.catalog });
    }
    setPreview(item: IProduct) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }
    
    setOrderField(field: keyof IOrder, value: string) {
        if (field in this.order) {
            // Приведение типа для обеспечения корректного присваивания значения
            (this.order as any)[field] = value;
        } else {
            console.error(`Поле ${field} не существует в заказе`);
        }
    
        if (this.validateOrder()) {
            this.events.emit('order:ready', this.order);
        }
    }


    validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
            errors.email = 'Не заполнен email';
        }
        if (!this.order.phone) {
            errors.phone = 'Не заполнен телефон';
        }
        if (!this.order.address) {
            errors.address = 'Не заполнен адрес';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }
   
}