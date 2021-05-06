// export class CheckConstructors {
//     constructor( input: HTMLInputElement, numbersSequenceInputBlockDOMClass: string, addButtonDOMClass: string)
//     constructor( numbersSequenceInputBlockDOMClass: string, addButtonDOMClass: string);
//     constructor( input: HTMLInputElement);
//     constructor();
//     constructor( ...args: any) {
//
//     }
// }
//
// // Correct:
// let c1 = new CheckConstructors(document.createElement('input'), '', '');
// let c2 = new CheckConstructors( '', '');
// let c3 = new CheckConstructors( document.createElement('input'));
// let c4 = new CheckConstructors();
//
// // Incorrect
// let c5 = new CheckConstructors(1, 2, 3);
// let c6 = new CheckConstructors('');