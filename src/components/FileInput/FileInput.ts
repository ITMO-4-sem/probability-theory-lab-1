export class FileInput {

    private readonly FILE_INPUT__INPUT_DOM_CLASS = 'file-input__input';
    private readonly FILE_INPUT__STATUS_DOM_CLASS = 'file-input__status';

    private readonly elFileInputInput: HTMLInputElement;
    private readonly  elFileInputStatus: HTMLSpanElement;

    private onFileChosenCallbacks: Array<OnFileChosenCallback> = [];


    constructor() {
        this.elFileInputInput = document.querySelector('.' + this.FILE_INPUT__INPUT_DOM_CLASS) as HTMLInputElement;
        this.elFileInputStatus = document.querySelector('.' + this.FILE_INPUT__STATUS_DOM_CLASS) as HTMLSpanElement;

        if ( this.elFileInputInput === null || this.elFileInputStatus === null ) {
            throw new Error('Invalid class names of html elements.');
        }

        this.init();
    }

    private init(): void {
        this.elFileInputInput.addEventListener('change', (e) => {

            const files = this.elFileInputInput.files;

            console.warn('input value is ..', this.elFileInputInput.value);
            if ( files &&  files.length != 0) {
                this.elFileInputStatus.innerText = files[0].name;
                this.emitOnFileChosenCallbacks(files[0]);
            } else {
                this.elFileInputStatus.innerText = 'No file chosen';
            }
        });
    }

    public onFileChosen( callback: OnFileChosenCallback ): void {
        this.onFileChosenCallbacks.push(callback);
    }

    private emitOnFileChosenCallbacks(file: File) {
        for ( const callback of this.onFileChosenCallbacks ) {
            callback.onChosen(file);
        }
    }


}

interface OnFileChosenCallback {
    onChosen(file: File): void
}
