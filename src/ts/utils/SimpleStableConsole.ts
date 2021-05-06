/**
 * Console.log() is passed a reference to the object, so the value in the Console changes as the object changes.
 * This class's aim to solve this 'problem'.
 */
export class SimpleStableConsole {
    public static log(message?: any, ...optionalParams: any[]): void {
        console.log( message + this.stringifyObjects(optionalParams));
    }


    public static warn(message?: any, ...optionalParams: any[]): void {
        console.warn( message + this.stringifyObjects(optionalParams));
    }

    public static error(message?: any, ...optionalParams: any[]): void {
        console.error( message + this.stringifyObjects(optionalParams));
    }


    private static stringify(o: unknown) {
        return JSON.parse(JSON.stringify(o))
    }
    
    private static stringifyObjects(...objects: any[]): string {
        let str = '';
        for ( const o of objects ) {
            str += this.stringify(o);
        }
        
        return str;
    }
}


// experiments

// const suits = ['hearts', 'spades', 'clubs', 'diamonds'];
//
// function pickCard(x: { suit: string; card: number }[]): number;
// function pickCard(x: number): { suit: string; card: number };
// function pickCard(x: any): any {
//     // Check to see if we're working with an object/array
//     // if so, they gave us the deck and we'll pick the card
//     if (typeof x == 'object') {
//         const pickedCard = Math.floor(Math.random() * x.length);
//         return pickedCard;
//     }
//     // Otherwise just let them pick the card
//     else if (typeof x == 'number') {
//         const pickedSuit = Math.floor(x / 13);
//         return { suit: suits[pickedSuit], card: x % 13 };
//     }
// }
//
// const myDeck = [
//     { suit: 'diamonds', card: 2 },
//     { suit: 'spades', card: 10 },
//     { suit: 'hearts', card: 4 },
// ];
//
//
// const pickedCard1 = myDeck[pickCard(myDeck)];
// alert('card: ' + pickedCard1.card + ' of ' + pickedCard1.suit);
//
// const pickedCard2 = pickCard(15);
// alert('card: ' + pickedCard2.card + ' of ' + pickedCard2.suit);
//
// function spread(...a: number[]): void {
//     console.error( 'a len = ', a.length)
// }
//
// spread(1, 2, 3);