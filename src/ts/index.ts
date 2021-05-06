import '@scss/index.scss'; // is necessary for connecting styles to index.html

import { NumSeqInputComponent } from '@/components/NumbersSequenceInputComponent/NumSeqInputComponent';

const numSeqInputComponent = new NumSeqInputComponent();

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.numSeqInputComponent = numSeqInputComponent;