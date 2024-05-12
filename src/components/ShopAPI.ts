import { IProduct, IOrder, SentOrder } from "../types";
import { Api, ApiListResponse } from "./base/Api";

export interface IShopAPI {
    getCardItem: (id: string) => Promise<IProduct>;
    getCatalog: () => Promise<IProduct[]>;
    orderCards: (order: IOrder) => Promise<SentOrder>;
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
    

    orderCards(order: IOrder): Promise<SentOrder> {
        return this.post('/order', { ...order, items: order.items.map((x) => x.id) })
        .then((res: Pick<SentOrder, 'id' | 'total'>) => {
            return { ...order, ...res };
        });
    }
}