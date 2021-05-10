
export class ToggleSwitch {

    private readonly SWITCH__CHECKBOX_DOM_CLASS = 'switch__checkbox';

    private readonly elSwitchCheckbox: HTMLInputElement;

    private readonly onSwitchToggledCallbacks: Array<OnSwitchToggledCallback> = [];

    constructor() {

        this.elSwitchCheckbox = document.querySelector('.' + this.SWITCH__CHECKBOX_DOM_CLASS ) as HTMLInputElement;

        if ( this.elSwitchCheckbox === null ) {
            throw new Error('Invalid html class.');
        }

        this.elSwitchCheckbox.addEventListener('change', (event) => {
            this.emitOnSwitchToggledCallbacks();
        });
    }

    private emitOnSwitchToggledCallbacks() {
        for ( const callback of this.onSwitchToggledCallbacks ) {
            callback.onToggled( this.isChecked() );
        }
    }

    public onSwitchToggled( callback: OnSwitchToggledCallback ): void {
        this.onSwitchToggledCallbacks.push(callback);
    }

    public isChecked(): boolean {
        return this.elSwitchCheckbox.checked;
    }

}//

interface OnSwitchToggledCallback {
    onToggled(isChecked: boolean): void
}
