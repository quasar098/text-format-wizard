import { v5 as uuidv5 } from 'uuid';


// the best things
export function replaceTag(k, v) {
    if (typeof v == "function") {
        return ((text) => {
            return text.replaceAll(new RegExp(`(?<!\\\\)%${k}%`,'g'), (...result) => v(...result)).replaceAll(`\\%${k}%`, `%${k}%`);
        })
    }
    return ((text) => {
        return text.replaceAll(new RegExp(`(?<!\\\\)%${k}%`,'g'), v).replaceAll(`\\%${k}%`, `%${k}%`);
    });
}


export const moduleColor = {
    encoding: "87abf0",
    ctf: "ead637",
    comment: "757577",
    generic: "fbb761",
    logic: "f9cb40",
    misc: "208f40"
}


export const MODULE_UUID_NAMESPACE = "b8f1195e-3214-472a-b2cd-cc7d1d329ba2";

// random string thing
function rst(input): string {
    return uuidv5(input, MODULE_UUID_NAMESPACE);
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
    HexToRGB = rst("HexToRGB"),
    RGBToHex = rst("RGBToHex"),
    RSAEncryption = rst("RSAEncryption"),
    SortLines = rst("SortLines"),
    HexDump = rst("HexDump"),
    PrependLineNumber = rst("PrependLineNumber"),
    XORHex = rst("XORHex"),
    FibonacciSequence = rst("FibonacciSequence"),
    LongToBytes = rst("LongToBytes"),
    BytesToLong = rst("BytesToLong")
}
