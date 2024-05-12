import { IOrderForm } from "../types";
import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";
import { Form } from "./common/Form";


export class OrderPaymentStepView extends Form<IOrderForm> {
	private _buttonOnline: HTMLButtonElement;
	private _buttonOnReceipt: HTMLButtonElement;
	private _addressInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._buttonOnline = ensureElement<HTMLButtonElement>(
			'button[name="card"]',
			this.container
		);
		this._buttonOnReceipt = ensureElement<HTMLButtonElement>(
			'button[name="cash"]',
			this.container
		);

		this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]',this.container);


        this._buttonOnline.addEventListener('click', () => {
			this.events.emit('order_change_payment_type');
		});

		this._buttonOnReceipt.addEventListener('click', () => {
			this.events.emit('order_change_payment_type')
		});
		
		this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`orderPaymentStepView:submit`);
        });
	}
	

	set payment(value: IOrderForm['payment']) {
		switch (value) {
			case 'card':
				this._buttonOnline.classList.add('button_alt-active');
				this._buttonOnReceipt.classList.remove('button_alt-active');
				break;
			case 'cash':
				this._buttonOnline.classList.remove('button_alt-active');
				this._buttonOnReceipt.classList.add('button_alt-active');
				break;
		}
	}

	
}

export class OrderUserContactsStep extends Form<IOrderForm> {
    protected _emailInput: HTMLInputElement;
	protected _phoneNumberInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]',this.container);
		this._phoneNumberInput = ensureElement<HTMLInputElement>('input[name="phone"]',this.container);

		
		this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`order:submit`);
        });
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
}