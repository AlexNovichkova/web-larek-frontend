

import {Model} from "./base/Model";
import {FormErrors, IAppState, ICard, IOrder, IOrderForm, IProduct, PaymentMethod} from "../types";

export type CatalogChangeEvent = {
    catalog: IProduct[]
};



export class AppState extends Model<IAppState> {
    basket: string[];
    catalog: IProduct[];
    loading: boolean;
    order: IOrder = {
        address: '',
        paymentMethod: PaymentMethod.Cash,
        items: []
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

    
}