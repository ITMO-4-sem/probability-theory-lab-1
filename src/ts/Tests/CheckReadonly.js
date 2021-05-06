"use strict";
exports.__esModule = true;
exports.CheckReadonly = void 0;
var CheckReadonly = /** @class */ (function () {
    function CheckReadonly() {
        this.obj = new Array(1, 2, 3);
        this.DEFAULT_STRING = "abra kadabra";
        this.objFullyReadonly = new Array(8, 9, 10);
    }
    CheckReadonly.prototype.printObj = function () {
        console.log(this.obj);
    };
    return CheckReadonly;
}());
exports.CheckReadonly = CheckReadonly;
var checkReadonly = new CheckReadonly();
// checkReadonly.obj = new Array<number>(4, 6, 7); // TS throws an Error
// ---
checkReadonly.obj[0] = 6;
console.log('obj = ', checkReadonly);
checkReadonly.objFullyReadonly = new Array(); // TS throws an Error
checkReadonly.objFullyReadonly[0] = 18; // TS throws an Error
