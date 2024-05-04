
import { Api, ApiListResponse } from './base/api';
import { IProduct, ICatalogModel, BasketModel, IOrderForm, IOrder, IOrderResult } from "../types";

export interface IShopAPI {
    getCardItem: (id: string) => Promise<IProduct>;
    getCatalog: () => Promise<IProduct[]>;
    getBasketItems: () => Promise<IProduct[]>;
    createOrder: (order: IOrderForm) => Promise<IOrderResult>;
}

export class ShopAPI extends Api implements IShopAPI {
    readonly cdn: string;
    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getCardItem(id: string): Promise<IProduct> {
        return this.get(`/product/${id}`).then(
            (item: IProduct) => ({
                ...item,
                image: this.cdn + item.image,
            })
        );
    }
    

    getCatalog(): Promise<IProduct[]> {
        return this.get('/product').then((data: ApiListResponse<IProduct>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    getBasketItems(): Promise<IProduct[]> {
        return this.get('/basket/items')
        .then((data: ApiListResponse<IProduct>) => data.items);
    }

    createOrder(order: IOrderForm): Promise<IOrderResult> {
        return this.post('/order', order)
        .then((data: IOrderResult) => data);
    }
}