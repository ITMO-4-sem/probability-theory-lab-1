export class CheckReadonly {
    public readonly obj = new Array<number>(
        1,
        2,
        3
    );

    public readonly DEFAULT_STRING = "abra kadabra";

    public readonly objFullyReadonly: ReadonlyArray<number> = new Array<number>(
        8,
        9,
        10
    );

    public objAlmostReadonly: ReadonlyArray<number> = new Array<number>(
        8,
        9,
        10
    );


    public printObj(): void {
        console.log(this.obj);
    }
}

const checkReadonly = new CheckReadonly();
// checkReadonly.obj = new Array<number>(4, 6, 7); // TS throws an Error
// ---
checkReadonly.obj[0] = 6;


console.log('obj = ', checkReadonly);

// checkReadonly.objFullyReadonly = new Array<number>(); // TS throws an Error
// checkReadonly.objFullyReadonly[0] = 18; // TS throws an Error

// checkReadonly.objAlmostReadonly = new Array<number>(); // allowed
// checkReadonly.objAlmostReadonly[0] = 11; // TS throws an Error : kek kek

const str: string = 'sdf';

str.replace("s", "d");