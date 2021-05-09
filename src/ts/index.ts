import '@scss/index.scss'; // is necessary for connecting styles to index.html

import { InputsSequenceComponent } from '@/components/InputsSequenceComponent/InputsSequenceComponent';

const inputsSequenceComponent = new InputsSequenceComponent({initInputsNumber: 1});



// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.inputsSequenceComponent = inputsSequenceComponent;