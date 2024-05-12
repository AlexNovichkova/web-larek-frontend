import { IOrderForm } from "../types";
import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/Events";
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
		
		
	}
	

	set payment(value: IOrderForm['payment']) {
		switch (value) {
			case 'card':
				this.toggleClass(this._buttonOnline,'button_alt-active', true);
				this.toggleClass(this._buttonOnReceipt,'button_alt-active', false);
				break;
			case 'cash':
				this.toggleClass(this._buttonOnline,'button_alt-active', false);
				this.toggleClass(this._buttonOnReceipt,'button_alt-active', true);
				break;
		}
	}

	
}

export class OrderUserContactsStep extends Form<IOrderForm> {
    protected _emailInput: HTMLInputElement;
	protected _phoneNumberInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._emailInput = this.container.elements.namedItem('email') as HTMLInputElement
        this._phoneNumberInput = this.container.elements.namedItem('phone') as HTMLInputElement
	
		
    }

    set phone (value: string) {
        this._phoneNumberInput.value = value;
    }

    set email (value: string) {
        this._emailInput.value = value;
    } 
}