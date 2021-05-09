/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./scss/index.scss":
/*!*************************!*\
  !*** ./scss/index.scss ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./components/InputsSequenceComponent/InputsSequenceComponent.ts":
/*!***********************************************************************!*\
  !*** ./components/InputsSequenceComponent/InputsSequenceComponent.ts ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "InputsSequenceComponent": () => (/* binding */ InputsSequenceComponent)
/* harmony export */ });
/* harmony import */ var _ts_Mode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ts/Mode */ "./components/InputsSequenceComponent/ts/Mode.ts");
/* harmony import */ var _components_InputsSequenceComponent_ts_Key__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/components/InputsSequenceComponent/ts/Key */ "./components/InputsSequenceComponent/ts/Key.ts");


/**
 * NumbersSequenceInputComponent. A component containing
 */
class InputsSequenceComponent {
    // onError
    // onWarn
    // setInputProps
    constructor(args) {
        this.inputsSequenceContainerDOMClass = InputsSequenceComponent.DEFAULT_INPUTS_SEQUENCE_CONTAINER_DOM_CLASS;
        this.switchDOMClass = InputsSequenceComponent.DEFAULT_SWITCH_DOM_CLASS;
        this.input = InputsSequenceComponent.DEFAULT_INPUT;
        this.mode = InputsSequenceComponent.DEFAULT_MODE;
        this.initInputsNumber = InputsSequenceComponent.DEFAULT_INIT_INPUTS_NUMBER;
        this.inputsList = new Array();
        const { input, initInputsNumber, inputsSequenceContainerSelector, switchSelector } = args;
        if (inputsSequenceContainerSelector != undefined) {
            if (inputsSequenceContainerSelector.length == 0) {
                throw new Error('Inputs sequenceContainer selector must not be an empty' +
                    ' string');
            }
            this.inputsSequenceContainerDOMClass = inputsSequenceContainerSelector;
        }
        if (switchSelector != undefined) {
            if (switchSelector.length == 0) {
                throw new Error('Switch selector must not be an empty' +
                    ' string');
            }
            this.switchDOMClass = switchSelector;
        }
        let isInputSpecified = false;
        if (input != undefined) {
            this.input = input;
            isInputSpecified = true;
        }
        if (initInputsNumber !== undefined) {
            if (initInputsNumber < 0) {
                throw new Error('Initial number of inputs can\'t be below "0"');
            }
            this.initInputsNumber = initInputsNumber;
        }
        this.elInputsSequenceContainer = document.querySelector('.' + this.inputsSequenceContainerDOMClass);
        this.elAddButton = document.querySelector('.' + this.inputsSequenceContainerDOMClass + '__add-button');
        this.elInputs = document.querySelector('.' + this.inputsSequenceContainerDOMClass + '__inputs');
        this.elSwitch = document.querySelector('.' + this.switchDOMClass);
        if (this.elInputsSequenceContainer === null
            || this.elAddButton === null
            || this.elInputs === null
            || this.elSwitch === null) {
            throw Error('HTML document doesn\'t contain elements with the specified' +
                ' class names.');
        }
        const existingInDOMInputs = this.findExistingInDOMInputs();
        if (isInputSpecified && existingInDOMInputs.length != 0) {
            throw new Error('Constructor parameter "input" is specified and there are' +
                ' existing "input" elements in DOM at the same time. Leave only one of' +
                ' these options.');
        }
        if (existingInDOMInputs.length != 0) {
            this.input = existingInDOMInputs[0].cloneNode();
            this.input.value = '';
        }
        for (const input of existingInDOMInputs) {
            this.inputsList.push(input);
        }
        if (this.initInputsNumber > existingInDOMInputs.length) {
            this.addSeveralInputs(this.initInputsNumber - existingInDOMInputs.length, true);
        }
        console.warn('inpList length = ', this.inputsList.length);
        this.init(); // initialize them all ...
    }
    /**
     * Main function for initialization.
     *
     */
    init() {
        this.elInputs.addEventListener('keyup', (event) => {
            if (!(event.target instanceof HTMLInputElement)) // Is this check
                // necessary ?
                return;
            const input = event.target;
            const pressedKey = event.code;
            switch (this.mode) {
                case (_ts_Mode__WEBPACK_IMPORTED_MODULE_0__.Mode.ADD): {
                    if (InputsSequenceComponent.KEYS_TO_ADD_INPUT.includes(pressedKey)) {
                        if (input === this.getLastInput() && this.areAllInputsFilledCorrectly()) {
                            this.addInput(true);
                        }
                        else {
                            const nextInput = this.getNextInput(input);
                            if (nextInput) {
                                nextInput.focus();
                            }
                        }
                    }
                    break;
                }
                case (_ts_Mode__WEBPACK_IMPORTED_MODULE_0__.Mode.DELETE): {
                    if (InputsSequenceComponent.KEYS_TO_DELETE_INPUT.includes(pressedKey)) {
                        const prevInput = this.getPrevInput(input);
                        this.deleteInput(event.target);
                        if (prevInput) {
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
        this.elAddButton.addEventListener('click', () => {
            switch (this.mode) {
                case (_ts_Mode__WEBPACK_IMPORTED_MODULE_0__.Mode.ADD): {
                    if (this.areAllInputsFilledCorrectly()) {
                        this.addInput(true);
                    }
                }
            }
        });
        this.elSwitch.addEventListener('change', () => {
            console.warn('mr Switch is clicked');
            switch (this.mode) {
                case (_ts_Mode__WEBPACK_IMPORTED_MODULE_0__.Mode.ADD): {
                    this.setMode(_ts_Mode__WEBPACK_IMPORTED_MODULE_0__.Mode.DELETE);
                    break;
                }
                case (_ts_Mode__WEBPACK_IMPORTED_MODULE_0__.Mode.DELETE): {
                    this.setMode(_ts_Mode__WEBPACK_IMPORTED_MODULE_0__.Mode.ADD);
                    break;
                }
                default: {
                    throw Error('Undefined "mode" is used');
                }
            }
            console.warn('new Mode = ', this.mode);
        });
    }
    findExistingInDOMInputs() {
        const existingInputs = new Array();
        for (const child of this.elInputs.children) {
            if (child instanceof HTMLInputElement) {
                existingInputs.push(child);
            }
        }
        return existingInputs;
    }
    areAllInputsFilledCorrectly() {
        for (const input of this.inputsList) {
            if (!input.checkValidity()) {
                input.reportValidity();
                return false;
            }
        }
        return true;
    }
    /**
     * Adds "input" to the end of {@link elInputs}.
     */
    addInput(setFocus) {
        const newInput = this.input.cloneNode();
        this.elInputs.append(newInput);
        this.inputsList.push(newInput);
        if (setFocus) {
            newInput.focus();
        }
    }
    addSeveralInputs(numOfInputs, setFocus) {
        if (numOfInputs < 0) {
            throw new Error('Number of inputs isn\'t allowed to be below "0"');
        }
        for (let i = 0; i < numOfInputs - 1; i++) { // -1 for setting focus for the
            // last input
            this.addInput(false);
        }
        this.addInput(setFocus);
    }
    /**
     * Deletes input from DOM.
     * @param {HTMLInputElement} input to delete.
     * @private
     */
    deleteInput(input) {
        const index = this.inputsList.indexOf(input);
        if (index === -1) {
            throw new Error('The specified "input" not found.');
        }
        input.remove();
        this.inputsList.splice(this.inputsList.indexOf(input), 1);
    }
    /**
     * Returns the last "input" element in the {@link elInputs} or "underfined"
     * if it wasn't found.
     * @param {HTMLCollection} collection
     * @returns {HTMLInputElement | undefined}
     */
    getLastInput() {
        return this.inputsList.length != 0 ? this.inputsList[this.inputsList.length - 1] : undefined;
    }
    getNextInput(input) {
        const index = this.inputsList.indexOf(input);
        if (index == -1 || index == this.inputsList.length - 1) {
            return undefined;
        }
        return this.inputsList[index + 1];
    }
    getPrevInput(input) {
        const index = this.inputsList.indexOf(input);
        if (index == -1 || index == 0) {
            return undefined;
        }
        return this.inputsList[index - 1];
    }
    /**
     * Deletes all inputs from "inputsSequenceContainer".
     * "non-input" elements aren't affected.
     */
    deleteAllInputs() {
        for (const input of this.inputsList) {
            input.remove();
        }
        this.inputsList = new Array();
    }
    setMode(mode) {
        this.setModeDOM(mode);
        this.mode = mode;
    }
    setModeDOM(mode, prevMode) {
        console.warn('first mode = ', this.inputsSequenceContainerDOMClass + this.mode);
        this.elInputsSequenceContainer.classList.remove(prevMode ? this.inputsSequenceContainerDOMClass + prevMode : this.inputsSequenceContainerDOMClass + this.mode);
        this.elInputsSequenceContainer.classList.add(this.inputsSequenceContainerDOMClass + mode);
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
    getValues() {
        const values = new Array();
        for (const input of this.inputsList) {
            values.push(input.value);
        }
        return {
            areAllInputsFilledCorrectly: this.areAllInputsFilledCorrectly(),
            values: values
        };
    }
}
// initializers block
InputsSequenceComponent.initializer = {
    defaultInput: function defaultInput() {
        const input = document.createElement('input');
        input.required = true;
        input.maxLength = 4;
        input.step = 'any';
        input.type = 'number';
        return input;
    }
};
InputsSequenceComponent.DEFAULT_INPUTS_SEQUENCE_CONTAINER_DOM_CLASS = 'inputs-sequence-container';
InputsSequenceComponent.DEFAULT_SWITCH_DOM_CLASS = 'switch';
InputsSequenceComponent.DEFAULT_INPUT = InputsSequenceComponent.initializer.defaultInput(); //NumbersSequenceInputComponent.initializeInputDefault(); // initialization is
InputsSequenceComponent.DEFAULT_MODE = _ts_Mode__WEBPACK_IMPORTED_MODULE_0__.Mode.ADD;
InputsSequenceComponent.DEFAULT_INIT_INPUTS_NUMBER = 4;
InputsSequenceComponent.KEYS_TO_ADD_INPUT = new Array(_components_InputsSequenceComponent_ts_Key__WEBPACK_IMPORTED_MODULE_1__.Key.Enter);
InputsSequenceComponent.KEYS_TO_DELETE_INPUT = new Array(_components_InputsSequenceComponent_ts_Key__WEBPACK_IMPORTED_MODULE_1__.Key.Backspace, _components_InputsSequenceComponent_ts_Key__WEBPACK_IMPORTED_MODULE_1__.Key.Space);


/***/ }),

/***/ "./components/InputsSequenceComponent/ts/Key.ts":
/*!******************************************************!*\
  !*** ./components/InputsSequenceComponent/ts/Key.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Key": () => (/* binding */ Key)
/* harmony export */ });
var Key;
(function (Key) {
    Key["Enter"] = "Enter";
    Key["Space"] = "Space";
    Key["Backspace"] = "Backspace";
    Key["Delete"] = "Delete";
    Key["ArrowRight"] = "ArrowRight";
    Key["ArrowLeft"] = "ArrowRight";
})(Key || (Key = {}));


/***/ }),

/***/ "./components/InputsSequenceComponent/ts/Mode.ts":
/*!*******************************************************!*\
  !*** ./components/InputsSequenceComponent/ts/Mode.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Mode": () => (/* binding */ Mode)
/* harmony export */ });
var Mode;
(function (Mode) {
    Mode["DELETE"] = "--mode-delete";
    Mode["ADD"] = "--mode-add";
})(Mode || (Mode = {}));


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./ts/index.ts ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @scss/index.scss */ "./scss/index.scss");
/* harmony import */ var _components_InputsSequenceComponent_InputsSequenceComponent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/components/InputsSequenceComponent/InputsSequenceComponent */ "./components/InputsSequenceComponent/InputsSequenceComponent.ts");
 // is necessary for connecting styles to index.html

const inputsSequenceComponent = new _components_InputsSequenceComponent_InputsSequenceComponent__WEBPACK_IMPORTED_MODULE_1__.InputsSequenceComponent({ initInputsNumber: 1 });
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.inputsSequenceComponent = inputsSequenceComponent;

})();

/******/ })()
;
//# sourceMappingURL=main.js.map