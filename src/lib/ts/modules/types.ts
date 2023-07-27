import { v5 as uuidv5 } from 'uuid';
import { tooltipStack } from '../stores'
import { genTooltip } from "../tooltip.ts"


// the best things
export function replaceTag(k,v) {
    if (typeof v == "function") {
        return ((text) => {
            return text.replaceAll(new RegExp(`(?<!\\\\)%${k}%`,'g'), (...result) => v(...result)).replaceAll(`\\%${k}%`, `%${k}%`);
        })
    }
    return ((text) => {
        return text.replaceAll(new RegExp(`(?<!\\\\)%${k}%`,'g'), v).replaceAll(`\\%${k}%`, `%${k}%`);
    });
}


export const WARNING_UUID = "01234567-0123-0123-1337-694204206969";
export const ERROR_UUID = "13333337-1337-1337-1337-133333333337";


export function showWarning(message) {
    tooltipStack.update((stack) => {
        stack.splice(0, 0, genTooltip(message, "Warning", WARNING_UUID));
        return stack;
    })
}


export function showError(message) {
    tooltipStack.update((stack) => {
        stack.splice(0, 0, genTooltip(message, "Error", WARNING_UUID));
        return stack;
    })
}


export const moduleColor = {
    encoding: "87abf0",
    ctf: "ead637",
    comment: "757577",
    generic: "fbb761",
    logic: "f9cb40",
    misc: "208f40"
}


export const UUID_NAMESPACE = "b8f1195e-3214-472a-b2cd-cc7d1d329ba2";

export let rstCount = 0;
// random string thing
function rst(): string {
    return uuidv5("" + (rstCount++), UUID_NAMESPACE);
}


export enum ModuleType {
    Append = rst(),
    Replace = rst(),
    Remove = rst(),
    Insert = rst(),
    InsertAfter = rst(),
    InsertBefore = rst(),
    Comment = rst(),
    ExecutePerLine = rst(),
    ExecutePerFind = rst(),
    ChangeCase = rst(),
    CountLineOccurences = rst(),
    CountMatches = rst(),
    KeepRegex = rst(),
    RemoveBlankLines = rst(),
    Hash = rst(),
    CountChars = rst(),
    Reverse = rst(),
    Reflect = rst(),
    Caesar = rst(),
    Base64 = rst(),
    CountLines = rst(),
    CountVowels = rst(),
    CountWords = rst(),
    CountConsonants = rst(),
    Rotate = rst(),
    SumDigits = rst(),
    Duplicate = rst(),
    XOREachByte = rst(),
    Binary = rst(),
    Hex = rst(),
    WordlistMask = rst(),
    Reset = rst(),
    RandomLine = rst(),
    Decimal = rst(),
    Cyclic = rst(),
    Store = rst(),
    Eval = rst(),
    HexToRGB = rst(),
    RGBToHex = rst()
}
