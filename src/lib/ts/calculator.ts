import { writable, get } from 'svelte/store';
import type { Writable } from "svelte/store";

// array of ones and zeros for accuracy and more control over javascript's number nonsense
type CalculatorNumber = {
    arr: Array<number>
}

export enum CalculatorSize {
    Byte,
    Word,
    DWord,
    QWord
}

export enum CalculatorRepr {
    Hex,
    Decimal,
    Octal,
    Binary
}

export enum CalculatorSigning {
    Unsigned,
    Signed
}

enum CalculatorOperationType {
    Add = "+",
    Subtract = "-",
    Multiply = "*",
    Divide = "/",
    RShift = ">>",
    LShift = "<<",
    Modulo = "%",
    Xor = "^",
    Or = "|",
    And = "&",
    Not = "~",
    Nor = "\\",
    Nand = "."
}

type CalculatorOperation = {
    operand: CalculatorNumber,
    operation: CalculatorOperationType
}

export type CalculatorRow = {
    original: CalculatorNumber,
    history: Array<CalculatorOperation>,
    historyIndex: number
}

let numberRepresentationsMemo = {};

function fixOverflow(arr: Array<number>, base?: number = 2): Array<number> {
    let i: number = 0;
    if (arr.length == 0) {
        return [];
    }
    while (true) {
        i += 1;
        let index: number = arr.length-i;
        let carry: number = Math.floor(arr[index]/base);
        let remainder: number = arr[index] % base;
        arr[index] = remainder;
        if (index == 0) {
            if (carry == 0) {
                break;
            }
            arr.splice(0, 0, 0);
            index += 1;
        }
        arr[index-1] += carry;
    }
    while (arr[0] == 0) {
        arr = arr.slice(1);
    }
    return arr;
}

function performOperation(calcNum1: CalculatorNumber, operation: CalculatorOperationType, calcNum2: CalculatorNumber, base?: number = 2): CalculatorNumber {
    let a1: Array<number> = [...calcNum1.arr];
    let a2: Array<number> = [...calcNum2.arr];
    while (a1.length > a2.length) {
        a2.splice(0, 0, 0);
    }
    while (a2.length > a1.length) {
        a1.splice(0, 0, 0);
    }
    if (operation == CalculatorOperationType.Add) {
        let newArr: Array<number> = [];
        for (let i=0; i<Math.max(a1.length, a2.length); i++) {
            let n1: number = a1[i] ?? 0;
            let n2: number = a2[i] ?? 0;
            newArr.push(n1+n2);
        }
        return { arr: fixOverflow(newArr, base) };
    }
    if (operation == CalculatorOperationType.Multiply) {
        let newArr: Array<number> = [0];
        let i: number = 0;
        while (i < a1.length) {
            i += 1;
            for (let q=0; q<(a1[a1.length-i] ?? 0); q++) {
                newArr = performOperation({ arr: newArr }, CalculatorOperationType.Add, { arr: a2 }, base).arr;
            }
            a2.push(0);
        }
        return { arr: newArr };
    }
    throw new Error(`unknown operation: ${operation}`);
}

export let calculatorSigning: Writable<CalculatorSigning> = writable(CalculatorSigning.Unsigned);
export let calculatorSize: Writable<CalculatorSize> = writable(CalculatorSize.QWord);
export let calculatorRepr: Writable<CalculatorRepr> = writable(CalculatorRepr.Hex);
export let calculatorRows: Writable<Array<CalculatorRow>> = writable([]);
export let calculatorRowInstanceId: Writable<number> = writable(0);

function stringNumberToCalculatorNumber(stringNumber: string): CalculatorNumber {
    if (/^0b[01]+$/.test(stringNumber)) {
        if (stringNumber.length > 2 && stringNumber[1] == 'b') {
            stringNumber = stringNumber.slice(2);
        }
        return {
            arr: stringNumber.split("").map(_=>_*1)
        }
    }
    if (/^0x[0-9a-f]+$/.test(stringNumber)) {
        stringNumber = stringNumber.slice(2);
        let arr = [];
        while (stringNumber.length) {
            arr.push(...parseInt(stringNumber[0], 16).toString(2).padStart(4, '0').split("").map(_=>_*1));
            stringNumber = stringNumber.slice(1);
        }
        return { arr: arr };
    }
    if (/^0o[0-7]+$/.test(stringNumber)) {
        stringNumber = stringNumber.slice(2);
        let arr = [];
        while (stringNumber.length) {
            arr.push(...parseInt(stringNumber[0], 8).toString(2).padStart(3, '0').split("").map(_=>_*1));
            stringNumber = stringNumber.slice(1);
        }
        return { arr: arr };
    }
    if (stringNumber.length > 2 && stringNumber[1] == "d") {
        stringNumber = stringNumber.slice(2);
    }
    let binOfDigits = stringNumber.split("").map(n => n*1).map(n => {
        return n.toString(2).padStart(4, "0").split("").map(q=>q*1)
    }).map(n => fixOverflow(n));
    let mulBy = [1];
    let total = [0];
    for (let i=binOfDigits.length-1; i>=0; i--) {
        let addNum = performOperation({ arr: mulBy }, CalculatorOperationType.Multiply, { arr: binOfDigits[i] }).arr;
        total = performOperation({ arr: total }, CalculatorOperationType.Add, { arr: addNum }).arr;
        mulBy = performOperation({ arr: mulBy }, CalculatorOperationType.Multiply, { arr: [1, 0, 1, 0] }).arr;
    }
    return { arr: total };
}

export function reprCalculatorNumber(calcNumber: CalculatorNumber): {[string]: string} {
    let binaryRepr: string = calcNumber.arr.map(_=>_+[]).join("");
    if (numberRepresentationsMemo[binaryRepr] !== undefined) {
        return numberRepresentationsMemo[binaryRepr];
    }

    let hexRepr: string = '';
    binaryRepr.split('').reverse().join("").replaceAll(/[01]{1,4}/gi, (m) => {
        hexRepr = (parseInt(m.split('').reverse().join("").padStart(4, '0'), 2).toString(16) + (hexRepr+[]))+[];
    });

    let octalRepr: string = '';
    binaryRepr.split('').reverse().join("").replaceAll(/[01]{1,3}/gi, (m) => {
        octalRepr = (parseInt(m.split('').reverse().join("").padStart(3, '0'), 2).toString(8) + (octalRepr+[]))+[];
    });

    let decimalArray: Array<number> = [0];
    let currentValue = [1];
    let revBinary: string = binaryRepr.split("").reverse().join("");
    for (let char of revBinary) {
        if (char*1 == 1) {
            decimalArray = performOperation({ arr: decimalArray }, CalculatorOperationType.Add, { arr: currentValue }, 10).arr;
        }
        currentValue = performOperation({ arr: currentValue }, CalculatorOperationType.Multiply, { arr: [2] }, 10).arr;
    }

    let numberRepresentations = {
        binary: '0b' + binaryRepr.replace(/^0+/, ''),
        hex: '0x' + hexRepr.replace(/^0+/, ''),
        octal: '0o' + octalRepr.replace(/^0+/, ''),
        decimal: decimalArray.map(_ => _+[]).join("")
    };
    numberRepresentationsMemo[binaryRepr] = numberRepresentations;
    return numberRepresentations;
}

export function newCalculatorRow(stringNumber: string): CalculatorRow {
    return {
        original: stringNumberToCalculatorNumber(stringNumber),
        history: [],
        historyIndex: 0
    }
}
