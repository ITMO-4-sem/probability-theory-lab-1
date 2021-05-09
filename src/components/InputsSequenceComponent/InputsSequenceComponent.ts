import { Mode } from './ts/Mode';
import { Key } from '@/components/InputsSequenceComponent/ts/Key';
import { InputsSequenceComponentResult } from '@/components/InputsSequenceComponent/ts/InputsSequenceComponentResult';


/**
 * NumbersSequenceInputComponent. A component containing
 */
export class InputsSequenceComponent {

    // initializers block
    private static readonly initializer = {
        defaultInput: function defaultInput(): HTMLInputElement {
            const input = document.createElement('input') as HTMLInputElement;
            input.required = true;
            input.maxLength = 4;
            input.step = 'any';
            input.type = 'number';

            return input;
        }
    };

    public static readonly DEFAULT_INPUTS_SEQUENCE_CONTAINER_DOM_CLASS: string = 'inputs-sequence-container';
    public static readonly DEFAULT_SWITCH_DOM_CLASS: string = 'switch';


    public static readonly DEFAULT_INPUT: Readonly<HTMLInputElement> = InputsSequenceComponent.initializer.defaultInput(); //NumbersSequenceInputComponent.initializeInputDefault(); // initialization is
    public static readonly DEFAULT_MODE = Mode.ADD;
    public static readonly DEFAULT_INIT_INPUTS_NUMBER: number = 4;

    public static readonly KEYS_TO_ADD_INPUT: ReadonlyArray<string> = new Array<Key>(
        Key.Enter,
    );

    public static readonly KEYS_TO_DELETE_INPUT: ReadonlyArray<string> = new Array<Key>(
        Key.Backspace,
        Key.Space,
    );


    private readonly inputsSequenceContainerDOMClass: string = InputsSequenceComponent.DEFAULT_INPUTS_SEQUENCE_CONTAINER_DOM_CLASS;
    private readonly switchDOMClass: string = InputsSequenceComponent.DEFAULT_SWITCH_DOM_CLASS;

    private input: HTMLInputElement = InputsSequenceComponent.DEFAULT_INPUT;
    private mode: Mode = InputsSequenceComponent.DEFAULT_MODE;
    private readonly initInputsNumber = InputsSequenceComponent.DEFAULT_INIT_INPUTS_NUMBER;


    private readonly elInputsSequenceContainer: HTMLDivElement;
    private readonly elAddButton: HTMLButtonElement;
    private readonly elInputs: HTMLDivElement;
    private readonly elSwitch: HTMLElement;


    private inputsList: Array<HTMLInputElement> = new Array<HTMLInputElement>();



// onError
// onWarn
// setInputProps





    constructor(args: {
        input?: HTMLInputElement,
        initInputsNumber?: number,
        inputsSequenceContainerSelector?: string,
        switchSelector?: string
    }) {

        const { input, initInputsNumber, inputsSequenceContainerSelector,  switchSelector } = args;

        if ( inputsSequenceContainerSelector != undefined ) {
            if ( inputsSequenceContainerSelector.length == 0 ) {
                throw new Error('Inputs sequenceContainer selector must not be an empty' +
                    ' string');
            }

            this.inputsSequenceContainerDOMClass = inputsSequenceContainerSelector;
        }

        if ( switchSelector != undefined ) {
            if ( switchSelector.length == 0 ) {
                throw new Error('Switch selector must not be an empty' +
                    ' string');
            }

            this.switchDOMClass = switchSelector;
        }

        let isInputSpecified = false;

        if ( input != undefined ) {
            this.input = input;
            isInputSpecified = true;
        }

        if ( initInputsNumber !== undefined ) {
            if ( initInputsNumber < 0 ) {
                throw new Error('Initial number of inputs can\'t be below "0"');
            }
            this.initInputsNumber = initInputsNumber;
        }


        this.elInputsSequenceContainer = document.querySelector( '.' + this.inputsSequenceContainerDOMClass ) as HTMLDivElement;
        this.elAddButton = document.querySelector( '.' + this.inputsSequenceContainerDOMClass + '__add-button' ) as HTMLButtonElement;
        this.elInputs = document.querySelector( '.' + this.inputsSequenceContainerDOMClass + '__inputs' ) as HTMLDivElement;
        this.elSwitch = document.querySelector( '.' + this.switchDOMClass ) as HTMLElement;

        if (   this.elInputsSequenceContainer === null
            || this.elAddButton === null
            || this.elInputs === null
            || this.elSwitch === null
        ) {
            throw Error( 'HTML document doesn\'t contain elements with the specified' +
                ' class names.' );
        }

        const existingInDOMInputs = this.findExistingInDOMInputs();

        if ( isInputSpecified && existingInDOMInputs.length != 0 ) {
            throw new Error('Constructor parameter "input" is specified and there are' +
                ' existing "input" elements in DOM at the same time. Leave only one of' +
                ' these options.');
        }

        if ( existingInDOMInputs.length != 0 ) {
            this.input = existingInDOMInputs[0].cloneNode() as HTMLInputElement;
            this.input.value = '';
        }

        for ( const input of existingInDOMInputs ) {
            this.inputsList.push( input );
        }

        if ( this.initInputsNumber > existingInDOMInputs.length ) {
            this.addSeveralInputs(this.initInputsNumber - existingInDOMInputs.length, true);
        }

        console.warn('inpList length = ', this.inputsList.length);

        this.init(); // initialize them all ...

    }


    /**
     * Main function for initialization.
     *
     */
    private init(): void {

        this.elInputs.addEventListener( 'keyup', (event: KeyboardEvent) => {

            if ( ! (event.target instanceof HTMLInputElement) ) // Is this check
                // necessary ?
                return;

            const input: HTMLInputElement = event.target as HTMLInputElement;

            const pressedKey: string = event.code;

            switch ( this.mode ) {
                case ( Mode.ADD ): {
                    if ( InputsSequenceComponent.KEYS_TO_ADD_INPUT.includes( pressedKey ) ) {
                        if ( input === this.getLastInput() && this.areAllInputsFilledCorrectly()) {
                                this.addInput(true);
                        } else {
                            const nextInput = this.getNextInput( input );
                            if ( nextInput ) {
                                nextInput.focus();
                            }
                        }
                    }
                    break;
                }
                case ( Mode.DELETE ): {

                    if ( InputsSequenceComponent.KEYS_TO_DELETE_INPUT.includes( pressedKey ) ) {
                        const prevInput = this.getPrevInput( input );
                        this.deleteInput( event.target );
                        if ( prevInput ) {
                            prevInput.focus();
                        }
                    }
                    break;
                }
                default: {
                    throw new Error('Unchecked Mode is used.');
                }
            }
        });


        this.elAddButton.addEventListener( 'click', () => {
            switch ( this.mode ) {
                case (Mode.ADD): {
                    if ( this.areAllInputsFilledCorrectly() ) {
                        this.addInput( true );
                    }
                }
            }
        });


        this.elSwitch.addEventListener( 'change', () => {
            console.warn('mr Switch is clicked');

            switch ( this.mode ) {
                case ( Mode.ADD ): {
                    this.setMode( Mode.DELETE );
                    break;
                }
                case ( Mode.DELETE ): {
                    this.setMode( Mode.ADD );
                    break;
                }
                default: {
                    throw Error('Undefined "mode" is used');
                }
            }

            console.warn('new Mode = ', this.mode);
        });
    }

    private findExistingInDOMInputs(): Array<HTMLInputElement> {
        const existingInputs = new Array<HTMLInputElement>();

        for ( const child of this.elInputs.children ) {
            if ( child instanceof HTMLInputElement ) {
                existingInputs.push( child );
            }
        }
        return existingInputs;
    }


    private areAllInputsFilledCorrectly(): boolean {

        for ( const input of this.inputsList ) {
            if ( ! input.checkValidity() ) {
                input.reportValidity();
                return false;
            }
        }
        return true;
    }


    /**
     * Adds "input" to the end of {@link elInputs}.
     */
    public addInput(setFocus?: boolean): void {
        const newInput = this.input.cloneNode() as HTMLInputElement;
        this.elInputs.append( newInput );
        this.inputsList.push( newInput );

        if ( setFocus ) {
            newInput.focus();
        }

    }

    public addSeveralInputs( numOfInputs: number, setFocus?: boolean ): void {
        if ( numOfInputs < 0 ) {
            throw new Error('Number of inputs isn\'t allowed to be below "0"');
        }
        for ( let i = 0; i < numOfInputs - 1; i++ ) { // -1 for setting focus for the
            // last input
            this.addInput( false );
        }

        this.addInput( setFocus );
    }


    /**
     * Deletes input from DOM.
     * @param {HTMLInputElement} input to delete.
     * @private
     */
    private deleteInput(input: HTMLInputElement): void {
        const index = this.inputsList.indexOf(input);

        if ( index === -1 ) {
            throw new Error('The specified "input" not found.');
        }

        input.remove();
        this.inputsList.splice( this.inputsList.indexOf(input), 1);
    }


    /**
     * Returns the last "input" element in the {@link elInputs} or "undefined"
     * if it wasn't found.
     * @returns {HTMLInputElement | undefined}
     */
    private getLastInput(): HTMLInputElement | undefined {
        return this.inputsList.length != 0 ? this.inputsList[this.inputsList.length - 1] : undefined;
    }


    private getNextInput( input: HTMLInputElement ) {
        const index = this.inputsList.indexOf( input );
        if ( index == -1 || index == this.inputsList.length - 1 ) {
            return undefined;
        }
        return this.inputsList[index + 1];
    }


    private getPrevInput( input: HTMLInputElement ) {
        const index = this.inputsList.indexOf( input );
        if ( index == -1 || index == 0 ) {
            return undefined;
        }
        return this.inputsList[index - 1];
    }



    /**
     * Deletes all inputs from "inputsSequenceContainer".
     * "non-input" elements aren't affected.
     */
    public deleteAllInputs(): void {

        for ( const input of this.inputsList ) {
            input.remove();
        }

        this.inputsList = new Array<HTMLInputElement>();
    }

    private setMode( mode: Mode ) {
        this.setModeDOM( mode );
        this.mode = mode;
    }


    private setModeDOM( mode: Mode, prevMode?: Mode ) {
        console.warn('first mode = ', this.inputsSequenceContainerDOMClass + this.mode);
        this.elInputsSequenceContainer.classList.remove( prevMode ? this.inputsSequenceContainerDOMClass + prevMode : this.inputsSequenceContainerDOMClass + this.mode );
        this.elInputsSequenceContainer.classList.add( this.inputsSequenceContainerDOMClass + mode );
    }


    // /**
    //  * @deprecated
    //  * Deletes all inputs from "numSeqInputBlock" just like
    //  * {@link deleteAllInputs} method but add a single new one. The only input
    //  * is not being undeleted but added, so it's cleared.
    //  */
    // public deleteAllInputsButOne(): void {
    //     this.deleteAllInputs();
    //     this.addInput();
    // }

    // /**
    //  * @deprecated
    //  * @param input
    //  * @see deleteAllInputs
    //  * @see deleteAllInputsButOne
    //  */
    // public setInput(input: HTMLInputElement): void {
    //     for ( const child of this.numSeqInputBlock.children ) {
    //         if ( child instanceof HTMLInputElement )
    //             throw Error( 'numSeqInputBlock contains inputs. You need to delete them at first.' );
    //     }
    //     this.input = input;
    //




    public getValues(): InputsSequenceComponentResult {
        const values: Array<any> = new Array<any>();

        for ( const input of this.inputsList ) {
            values.push( input.value );
        }

        return {
            areAllInputsFilledCorrectly: this.areAllInputsFilledCorrectly(),
            values: values
        };
    }



}