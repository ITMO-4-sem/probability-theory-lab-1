import { Mode } from './Mode';
import { Key } from '@/components/NumbersSequenceInputComponent/Key';
import { NumSeqInputComponentResult } from '@/components/NumbersSequenceInputComponent/NumSeqInputComponentResult';


/**
 * NumbersSequenceInputComponent. A component containing
 */
export class NumSeqInputComponent {

    // initializers block
    private static readonly initializer = {
        defaultInput: function defaultInput(): HTMLInputElement {
            const input = document.createElement('input') as HTMLInputElement;
            input.required = true;
            input.maxLength = 4;
            input.step = 'any';
            input.type = 'number';
            input.classList.add('number-input'); // is it necessary?

            return input;
        }
    };

    public static readonly DEFAULT_NUM_SEQ_INPUT_BLOCK_DOM_CLASS: string = '.numbers-sequence-input-add';
    public static readonly DEFAULT_ADD_BUTTON_DOM_CLASS: string = '.numbers-sequence-input';
    public static readonly DEFAULT_INPUT: Readonly<HTMLInputElement> = NumSeqInputComponent.initializer.defaultInput(); //NumbersSequenceInputComponent.initializeInputDefault(); // initialization is
    public static readonly DEFAULT_MODE = Mode.ADD;

    public static readonly KEYS_TO_ADD_INPUT: ReadonlyArray<string> = new Array<Key>(
        Key.Enter,
    );

    public static readonly KEYS_TO_DELETE_INPUT: ReadonlyArray<string> = new Array<Key>(
        Key.Backspace,
        Key.Space,
    );

    public readonly numsSeqInputBlockDOMClass: string = NumSeqInputComponent.DEFAULT_NUM_SEQ_INPUT_BLOCK_DOM_CLASS;
    public readonly addButtonDOMClass: string = NumSeqInputComponent.DEFAULT_ADD_BUTTON_DOM_CLASS;
    private readonly input: HTMLInputElement = NumSeqInputComponent.DEFAULT_INPUT;
    public readonly mode: Mode = NumSeqInputComponent.DEFAULT_MODE;


    private readonly addButton: HTMLButtonElement;
    private readonly numSeqInputBlock: HTMLDivElement;

    private inputsList: Array<HTMLInputElement> = new Array<HTMLInputElement>();



// onError
// onWarn
// setInputProps





    constructor( input: HTMLInputElement, numsSeqInputBlockDOMClass: string, addButtonDOMClass: string)
    constructor( numsSeqInputBlockDOMClass: string, addButtonDOMClass: string);
    constructor( input: HTMLInputElement );
    constructor();
    constructor( ...args: any ) {

        let isInputSpecified = false;

        if ( args.length == 3 ) {
            this.input = args[0];
            isInputSpecified = true;
            this.numsSeqInputBlockDOMClass = args[1];
            this.addButtonDOMClass = args[2];

        } else if ( args.length == 2 ) {
            this.numsSeqInputBlockDOMClass = args[0];
            this.addButtonDOMClass = args[1];

        } else if ( args.length == 1 ) {
            this.input = args[0];
        }




        this.addButton = document.querySelector( this.numsSeqInputBlockDOMClass ) as HTMLButtonElement;
        this.numSeqInputBlock = document.querySelector( this.addButtonDOMClass ) as HTMLDivElement;

        if ( this.addButton == null || this.numSeqInputBlock == null ) {
            throw Error( 'HTML document doesn\'t contain elements with the specified' +
                ' class names.' );
        }

        const existingInDOMInput = this.findExistingInputInDOM();

        if ( ! isInputSpecified && existingInDOMInput ) {

            this.input = existingInDOMInput.cloneNode() as HTMLInputElement;
            this.input.value = '';
        }

        this.inputsList.push( this.input );

        this.init(); // initialize them all ...

    }


    /**
     * Main function for initialization.
     *
     */
    private init(): void {

        this.numSeqInputBlock.addEventListener( 'keyup', (event: KeyboardEvent) => {

            if ( ! (event.target instanceof HTMLInputElement) ) // Is this check
                // necessary ?
                return;

            const pressedKey: string = event.code;

            switch ( this.mode ) {
                case ( Mode.ADD ): {
                    if ( NumSeqInputComponent.KEYS_TO_ADD_INPUT.includes( pressedKey )
                        && event.target === this.getLastInput( this.numSeqInputBlock.children )
                        && this.areAllInputsFilledCorrectly()
                    ) {
                        this.addInput(true);
                    }
                    break;
                }
                case ( Mode.DELETE ): {

                    if ( NumSeqInputComponent.KEYS_TO_DELETE_INPUT.includes( pressedKey ) ) {
                        console.warn('trying to delete');
                        this.deleteInput( event.target );
                    }
                    break;
                }
                default: {
                    throw new Error('Unchecked Mode is used.');
                }
            }
        });


        this.addButton.addEventListener( 'click', () => {
            if ( this.areAllInputsFilledCorrectly() ) {
                this.addInput( true );
            }
        });
    }

    private findExistingInputInDOM(): HTMLInputElement | undefined {
        for ( const child of this.numSeqInputBlock.children ) {
            if ( child instanceof HTMLInputElement ) {
                return child as HTMLInputElement;
            }
        }
        return undefined;
    }


    private areAllInputsFilledCorrectly(): boolean {
        for ( const child of this.numSeqInputBlock.children ) {
            if ( child instanceof HTMLInputElement ) {
                const childAsInput = child as HTMLInputElement;
                if ( ! (childAsInput).checkValidity() ) {
                    childAsInput.reportValidity();
                    return false;
                }
            }
        }

        for ( const input of this.inputsList ) {
            if ( ! input.checkValidity() ) {
                input.reportValidity();
                return false;
            }
        }
        return true;
    }


    /**
     * Adds "input" to the end of {@link numSeqInputBlock}.
     */
    public addInput(setFocus?: boolean): void {
        const newInput = this.input.cloneNode() as HTMLInputElement;
        this.numSeqInputBlock.append( newInput );

        if ( setFocus ) {
            newInput.focus();
        }

    }


    /**
     * Deletes input from DOM.
     * @param {HTMLInputElement} input to delete.
     * @private
     */
    private deleteInput(input: HTMLInputElement): void {
        input.remove();
    }


    /**
     * Returns the last "input" element in the {@link numSeqInputBlock} or "underfined"
     * if it wasn't found.
     * @param {HTMLCollection} collection
     * @returns {HTMLInputElement | undefined}
     */
    private getLastInput(collection: HTMLCollection): HTMLInputElement | undefined {
        const inputType: string = this.input.type;
        for ( let i = collection.length - 1; i > 0; i-- ) {
            if ( collection[i] instanceof HTMLInputElement
                 && (collection[i] as HTMLInputElement).type == inputType ) {
                console.log('Last input found.');
                return collection[i] as HTMLInputElement;
            }
        }

        return undefined;
    }


    // /**
    //  * @deprecated
    //  * Deletes all inputs from "numSeqInputBlock".
    //  * "non-input" elements aren't affected.
    //  */
    // public deleteAllInputs(): void {
    //
    //     /**
    //      * Is implemented this way not to delete 'non-input' elements (they may
    //      * be added to this component).
    //      */
    //     const inputsToDelete: Array<HTMLInputElement> = new Array<HTMLInputElement>();
    //     for ( const input of this.numSeqInputBlock.children ) {
    //         if ( input instanceof HTMLInputElement ) {
    //             inputsToDelete.push( input );
    //         }
    //     }
    //
    //     inputsToDelete.forEach( (input) => {
    //         input.remove();
    //     } );
    // }


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


    public getAddButtonDOMClass(): string {
        return this.addButtonDOMClass;
    }


    public getNumSeqInputBlockDOMClass(): string {
        return this.numsSeqInputBlockDOMClass;
    }




    public getValues(): NumSeqInputComponentResult { // todo
        const values: Array<any> = new Array<any>();

        for ( const child of this.numSeqInputBlock.children ) {
            if ( child instanceof HTMLInputElement ) {
                values.push( (child as HTMLInputElement).value );
            }
        }
        return {
            areAllInputsFilledCorrectly: this.areAllInputsFilledCorrectly(),
            values: values
        };
    }



}