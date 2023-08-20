import { ModuleType, moduleColor } from "../module.ts";
import { showWarning } from "../tooltip.ts"
import { md5 } from "../md5.ts";
import { sha256 } from "../sha256.ts"


export const moduleMetadata = {
    [ModuleType.Binary]: {
        name: "Binary",
        color: moduleColor.encoding,
        lore: "Convert to and from 0s and 1s",
        description: "Map 8-digit binary integers to UTF-8. Works in reverse too",
        processMaker: (args) => {
            let { method } = args;
            method = method ?? "decode";
            try {
                return (text) => {
                    try {
                        if (method == "decode") {
                            let cleansed = text.replaceAll(/[^01]+/g, "");
                            if (cleansed.length % 8) {
                                showWarning("The # of 0s and 1s is not divisible by eight");
                                return text;
                            }
                            let total = "";
                            while (cleansed.length) {
                                cleansed = cleansed.replaceAll(/.{8}$/g, (_) => {
                                    total = String.fromCharCode(parseInt(_, 2)) + total;
                                    return "";
                                })
                            }
                            return total;
                        } else {
                            return (
                                Array
                                .from(text)
                                .reduce((acc, char) => acc.concat(char.charCodeAt().toString(2)), [])
                                .map(bin => '0'.repeat(8 - bin.length) + bin)
                                .join(' ')
                            );
                        }
                    } catch (e) {
                        showWarning("Evaluation error at Binary module");
                        return text;
                    }
                }
            } catch {
                showWarning(`Unspecified error at Binary module`);
                return text => text;
            }
        }
    },
    [ModuleType.Decimal]: {
        name: "Decimal",
        color: moduleColor.encoding,
        lore: "Convert to and from decimal",
        description: "UTF-8 to decimal converter. Works in reverse too",
        processMaker: (args) => {
            let { method } = args;
            method = method ?? "decode";
            try {
                return (text) => {
                    try {
                        if (method == "decode") {
                            let cleansed = text.replaceAll(/[^\d]+/g, " ");
                            let total = "";
                            cleansed = cleansed.replaceAll(/\d{1,3}/g, (_) => {
                                total += String.fromCharCode(parseInt(_));
                                return "";
                            })
                            return total;
                        } else {
                            return (
                                Array
                                .from(text)
                                .reduce((acc, char) => acc.concat(char.charCodeAt().toString()), [])
                                .join(' ')
                            );
                        }
                    } catch (e) {
                        showWarning("Evaluation error at Decimal module");
                        return text;
                    }
                }
            } catch {
                showWarning(`Unspecified error at Decimal module`);
                return text => text;
            }
        }
    },
    [ModuleType.Hex]: {
        name: "Hexadecimal",
        color: moduleColor.encoding,
        lore: "Convert ASCII to hexadecimal and vice versa",
        description: "Convert ASCII to hexadecimal and other way too",
        processMaker: (args) => {
            let { method } = args;
            method = method ?? "decode";
            try {
                return (text) => {
                    try {
                        if (method == "decode") {
                            text = text.replace(/^0x/, '');
                            let cleansed = text.replaceAll(/[^0123456789abcdef]/gi, "");
                            if (cleansed.length % 2) {
                                showWarning("Hexadecimal module takes groups of 2 hex digits at a time");
                                return text;
                            }
                            let total = "";
                            while (cleansed.length) {
                                cleansed = cleansed.replaceAll(/.{2}$/g, (_) => {
                                    total = String.fromCharCode(parseInt(_, 16)) + total;
                                    return "";
                                })
                            }
                            return total;
                        } else {
                            return Array.from(text).map(c =>
                                c.charCodeAt(0) < 128 ? c.charCodeAt(0).toString(16).padStart(2, '0') :
                                encodeURIComponent(c).replace(/\%/g,'').toLowerCase()
                              ).join('');
                        }
                    } catch {
                        showWarning(`Evaluation error at Hexadecimal module`);
                        return text;
                    }
                }
            } catch {
                showWarning(`Unspecified error at Hexadecimal module`);
                return text => text;
            }
        }
    },
    [ModuleType.XORStrings]: {
        name: "XOR Strings",
        color: moduleColor.encoding,
        lore: "XOR String ASCII values like \"[\" ^ \"*\" -> \"p\"",
        description: "Work the magic!!",
        processMaker: (args) => {
            let { key } = args;
            key = key ?? 0;
            if (key.length == 0) {
                return (text) => text;
            }
            try {
                return (text) => {
                    let newv = "";
                    for (let letterIndex in text) {
                        newv += String.fromCharCode(text.charCodeAt(letterIndex)^(key).charCodeAt(letterIndex % key.length));
                    }
                    return newv;
                }
            } catch {
                showWarning("Invalid integer value at XOR Each Byte module");
            }
        }
    },
    [ModuleType.XORHex]: {
        name: "XOR Hex",
        color: moduleColor.encoding,
        lore: "XOR Hex values like \"69\" ^ \"2f\" -> \"46\"",
        description: "Work the magic harder!!!",
        processMaker: (args) => {
            let { key } = args;
            key = key ?? "";
            if (key.length % 2) {
                showWarning("XOR Hex module key invalid length");
                return text => text;
            }
            if (key.length == 0) {
                return text => text;
            }
            key = key.match(/.{2}/g);
            return (text) => {
                try {
                    let newText = '';
                    for (let charIndex in text) {
                        newText += String.fromCharCode(text.charCodeAt(charIndex) ^ (+('0x'+key[charIndex % key.length])));
                    }
                    return newText;
                } catch (e) {
                    console.log(e);
                    showWarning("XOR Hex error!");
                    return text;
                }
            }
        }
    },
    [ModuleType.Hash]: {
        name: "Hash Algorithm",
        color: moduleColor.encoding,
        lore: "Hash the text with a hash algorithm",
        description: "Hash the text with a hash algorithm like sha256",
        processMaker: (args) => {
            let { algorithm } = args;
            algorithm = algorithm ?? "";
            var crc32=function(r){for(var a,o=[],c=0;c<256;c++){a=c;
                for(var f=0;f<8;f++)a=1&a?3988292384^a>>>1:a>>>1;o[c]=a}
                for(var n=-1,t=0;t<r.length;t++)n=n>>>8^o[255&(n^r.charCodeAt(t))];
                return((-1^n)>>>0).toString(16).padStart(8, '0')};
            switch (algorithm.toLowerCase().replaceAll("-", "")) {
                case "md5":
                    return text => md5(text);
                case "sha256":
                    return text => sha256(text);
                case "crc32":
                    return text => crc32(text);
                default:
                    return text => text;
            }
        }
    },
    [ModuleType.Caesar]: {
        name: "Caesar Shift",
        color: moduleColor.encoding,
        lore: "Shift the text with caesar cipher",
        description: "Shift the text with caesar cipher. Works on letters A-Z (and a-z)",
        processMaker: (args) => {
            function caesarCipher(word, next) {
                next = next % 26; let res = ""; for (const letter of word) {
                    let letterCode = letter.charCodeAt(0);
                    if (letterCode >= 65 && letterCode <= 90) {
                      letterCode = letterCode + next;
                      if (letterCode > 90) {
                        letterCode = letterCode - 26;
                      } else if (letterCode < 65) {
                        letterCode = letterCode + 26;
                      }
                    } else if (letterCode >= 97 && letterCode <= 122) {
                      letterCode = letterCode + next;

                      if (letterCode > 122) {
                        letterCode = letterCode - 26;
                      } else if (letterCode < 97) {
                        letterCode = letterCode + 26;
                      }
                    }
                    res = res + String.fromCharCode(letterCode);
                }
                return res;
            }
            function isNumeric(value) {
                return /^-?\d+$/.test(value);
            }
            let { shift } = args;
            shift = shift ?? 0;
            return (text) => {
                if (isNumeric(shift)) {
                    return caesarCipher(text, shift);
                } else {
                    showWarning("Caesar shift takes a number");
                    return text;
                }
            }
        }
    },
    [ModuleType.Base64]: {
        name: "Base 64 Encryption",
        color: moduleColor.encoding,
        lore: "Encrypt or decrypt base 64",
        description: "Encrypt or decrypt base 64",
        processMaker: (args) => {
            let { method } = args;
            method = method ?? "encrypt";
            return (text) => {
                try {
                    if (method == "encrypt") {
                        return btoa(text);
                    } else if (method == "decrypt") {
                        return atob(text);
                    } else {
                        return text;
                    }
                } catch {
                    showWarning("Error with Base64 Module")
                    return text;
                }
            }
        }
    },
}
