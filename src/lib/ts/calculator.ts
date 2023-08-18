import { writable, get } from 'svelte/store';
import type { Writable } from "svelte/store";

// array of ones and zeros for accuracy and more control over javascript's number nonsense
type CalculatorNumber = {
    arr: Array<number>
}

enum CalculatorOperation {
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
    operation: CalculatorOperation
}

export type CalculatorRow = {
    original: CalculatorNumber,
    history: Array<CalculatorOperation>,
    historyIndex: number
}

export let calculatorRows: Writable<Array<CalculatorRow>> = writable([]);
export let calculatorRowInstanceId: Writable<number> = writable(0);

function stringNumberToCalculatorNumber(stringNumber: string): CalculatorNumber {
    if (/^((0b)|[01]{8})[01]+$/.test(stringNumber)) {
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
            console.log(arr);
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

}

export function reprCalculatorNumber(calcNumber: CalculatorNumber): {[string]: string} {
    let binaryRepr: string = calcNumber.arr.map(_=>_+[]).join("");
    let hexRepr: string = '';
    let octalRepr: string = '';
    binaryRepr.split('').reverse().join("").replaceAll(/[01]{1,4}/gi, (m) => {
        hexRepr = (parseInt(m.split('').reverse().join("").padStart(4, '0'), 2).toString(16) + (hexRepr+[]))+[];
    });
    binaryRepr.split('').reverse().join("").replaceAll(/[01]{1,3}/gi, (m) => {
        octalRepr = (parseInt(m.split('').reverse().join("").padStart(3, '0'), 2).toString(8) + (octalRepr+[]))+[];
    });
    let numberRepresentations = {
        binary: '0b' + binaryRepr.replace(/^0+/, ''),
        hex: '0x' + hexRepr.replace(/^0+/, ''),
        octal: '0o' + octalRepr.replace(/^0+/, '')
    };
    return numberRepresentations;
}

export function newCalculatorRow(stringNumber: string): CalculatorRow {
    return {
        original: stringNumberToCalculatorNumber(stringNumber),
        history: [],
        historyIndex: 0
    }
}
