import {Component} from "../base/Component";
import {ensureElement} from "../../utils/utils";

interface ISuccess {
    description: string;
}

interface ISuccessActions {
    onClose: () => void;
}

export class Success extends Component<ISuccess> {
    private _closeButton: HTMLButtonElement;
	private _description: HTMLElement;

    constructor(container: HTMLElement, events: ISuccessActions) {
        super(container);

        this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close',this.container);
		this._closeButton.addEventListener('click', () => {
			events.onClose();
		});

		this._description = ensureElement<HTMLElement>('.order-success__description',this.container); 
    }

    set description(value: string) {
		this.setText(this._description, value);
	}
}