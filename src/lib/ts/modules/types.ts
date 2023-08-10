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
function rst(input): string {
    return uuidv5(input, UUID_NAMESPACE);
}


export enum ModuleType {
    Append = rst("Append"),
    Replace = rst("Replace"),
    Remove = rst("Remove"),
    Insert = rst("Insert"),
    InsertAfter = rst("InsertAfter"),
    InsertBefore = rst("InsertBefore"),
    Comment = rst("Comment"),
    ExecutePerLine = rst("ExecutePerLine"),
    ExecutePerFind = rst("ExecutePerFind"),
    ChangeCase = rst("ChangeCase"),
    CountLineOccurences = rst("CountLineOccurences"),
    CountMatches = rst("CountMatches"),
    KeepRegex = rst("KeepRegex"),
    RemoveBlankLines = rst("RemoveBlankLines"),
    Hash = rst("Hash"),
    CountChars = rst("CountChars"),
    Reverse = rst("Reverse"),
    Reflect = rst("Reflect"),
    Caesar = rst("Caesar"),
    Base64 = rst("Base64"),
    CountLines = rst("CountLines"),
    CountVowels = rst("CountVowels"),
    CountWords = rst("CountWords"),
    CountConsonants = rst("CountConsonants"),
    Rotate = rst("Rotate"),
    SumDigits = rst("SumDigits"),
    Duplicate = rst("Duplicate"),
    XORStrings = rst("XORStrings"),
    Binary = rst("Binary"),
    Hex = rst("Hex"),
    WordlistMask = rst("WordlistMask"),
    Reset = rst("Reset"),
    RandomLine = rst("RandomLine"),
    Decimal = rst("Decimal"),
    Cyclic = rst("Cyclic"),
    Store = rst("Store"),
    Eval = rst("Eval"),
    HexToRGB = rst("HexToRGB"),
    RGBToHex = rst("RGBToHex"),
    RSAEncryption = rst("RSAEncryption"),
    SortLines = rst("SortLines"),
    HexDump = rst("HexDump"),
    PrependLineNumber = rst("PrependLineNumber"),
    XORHex = rst("XORHex")
}
