import { ModuleType, moduleColor } from "./types.ts";


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
    [ModuleType.Hex]: {
        name: "Hexadecimal",
        color: moduleColor.encoding,
        lore: "Convert UTF-8 to hexadecimal and vice versa",
        description: "Convert UTF-8 to hexadecimal and other way too. Choose UTF-8 if unsure which to choose",
        processMaker: (args) => {
            let { method } = args;
            method = method ?? "decode (ascii)";
            try {
                return (text) => {
                    try {
                        if (method == "decode (ascii)") {
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
                        } else if (method == "decode (utf-8)") {
                            let cleansed = text.replaceAll(/[^0123456789abcdef]/gi, "");
                            if (cleansed.length % 2) {
                                showWarning("Hexadecimal module takes groups of 2 hex digits at a time");
                                return text;
                            }
                            return decodeURIComponent('%' + cleansed.match(/.{1,2}/g).join('%'));;
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
    [ModuleType.XOREachByte]: {
        name: "XOR Each Byte",
        color: moduleColor.encoding,
        lore: "XOR each byte",
        description: "Take the ascii value of a bit, and then XOR it by a value between 0-255",
        processMaker: (args) => {
            let { value } = args;
            value = value ?? 0;
            if (value > 255) {
                showWarning("Too high integer at XOR Each Byte module");
                return (text) => text;
            }
            if (value < 0) {
                showWarning("Too low integer at XOR Each Byte module");
                return (text) => text;
            }
            try {
                return (text) => text.split("").map(_ => String.fromCharCode(_.charCodeAt(0)^value)).join("");
            } catch {
                showWarning("Invalid integer value at XOR Each Byte module");
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
            switch (algorithm.toLowerCase().replaceAll("-", "")) {
                case "md5":
                    return text => md5(text);
                case "sha256":
                    return text => sha256(text);
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
