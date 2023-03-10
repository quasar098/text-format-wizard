import { recipeModules, outputAsJs } from './stores'
import { get } from "svelte/store"
import { md5 } from "./md5.ts";
import { caesarCipher } from "./caesar.ts";
import { sha256 } from "./sha256.ts"

export let uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/g;

// random string thing
function rst(): string {
    return crypto.randomUUID();
}

// wtf
const replaceTag = (k,v)=>((text)=>text.replaceAll(new RegExp(`(?<!\\\\)%${k}%`,'g'),v).replaceAll(`\\%${k}%`,`%${k}%`))

export enum ModuleType {
    Append = rst(),
    Replace = rst(),
    Remove = rst(),
    Insert = rst(),
    RandomCase = rst(),
    InsertAfter = rst(),
    InsertBefore = rst(),
    Comment = rst(),
    ExecutePerLine = rst(),
    ExecutePerFind = rst(),
    ChangeCase = rst(),
    CountLineOccurences = rst(),
    CountMatches = rst(),
    CaptureGroup = rst(),
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
    Rotate = rst()
}

let moduleMap_ = {};

(() => {
    for (let mType_ of Object.keys(ModuleType)) {
        if (!uuidRegex.test(ModuleType[mType_])) {
            moduleMap_[mType_] = undefined;
            import(`../modules/${ModuleType[mType_]}Module.svelte`).then(mod => {
                moduleMap_[mType_] = mod.default;
            })
        }
    }
})()

export const moduleMap = moduleMap_;

let moduleMetadata = {
    [ModuleType.Remove]: {
        name: "Regex Remove",
        color: "e23e31",
        lore: "Remove any matches of regex",
        description: "Find matches of regex and remove them from the text",
        processMaker: (args) => {
            let { remove } = args;
            remove = remove ?? "";
            try {
                let regexp = new RegExp(remove, 'g')
                return (text) => { return text.replaceAll(regexp, '') }
            } catch {
                // todo: raise error here
                return text => text;
            }
        }
    },
    [ModuleType.RemoveBlankLines]: {
        name: "Remove Blank Lines",
        color: "e23e31",
        lore: "Self explanatory",
        description: "Self explanatory",
        processMaker: (args) => {
            return text => text.split("\n").filter(_ => _ != '').join("\n");
        }
    },
    [ModuleType.Replace]: {
        name: "Regex Replace",
        color: "f9cb40",
        lore: "Replace any matches of regex",
        description: "Find matches of regex and replace each of those matches with another text",
        processMaker: (args) => {
            let { remove, insert } = args;
            remove = remove ?? "";
            insert = insert ?? "";
            try {
                let regexp = new RegExp(remove, 'g')
                return (text) => { return text.replaceAll(regexp, insert) }
            } catch {
                // todo: raise error here
                return text => text;
            }
        }
    },
    [ModuleType.Append]: {
        name: "Append",
        color: "208f40",
        lore: "Append to the end of the text",
        description: "Add a specified text to the end of the current text",
        processMaker: (args) => {
            let { append } = args;
            append = append ?? "";
            return (text) => text + append
        }
    },
    [ModuleType.Insert]: {
        name: "Insert",
        color: "208f40",
        lore: "Insert text at a specific index",
        description: "Insert text at a specific index in the text. Will not replace text.",
        processMaker: (args) => {
            let { insert, index } = args;
            insert = insert ?? "";
            index = index ?? 0;
            if (isNaN(parseInt(index))) {
                // todo: raise error here
                return text => text;
            }
            index = parseInt(index);
            return (text) => text.slice(0, index) + insert + text.slice(index)
        }
    },
    [ModuleType.RandomCase]: {
        name: "Random Case",
        color: "fbb761",
        lore: "Randomize the case of the text",
        description: "Randomize uppercase/lowercase for each letter of the text",
        processMaker: (args) => {
            return (text) => {
                let newText = "";
                for (let letter of text) {
                    newText += Math.random() > 0.5 ? letter.toUpperCase() : letter.toLowerCase();
                }
                return newText;
            }
        }
    },
    [ModuleType.InsertAfter]: {
        name: "Insert After",
        color: "208f40",
        lore: "Insert text after some text",
        description: "Insert a string after each regex match",
        processMaker: (args) => {
            let { insert, before } = args;
            insert = insert ?? "";
            before = before ?? "";
            try {
                let beforeRegex = new RegExp(before, 'g')
                return (text) => {
                    let matches = text.matchAll(beforeRegex);
                    let moffs = 0;
                    for (let match of matches) {
                        let index = match.index+match[0].length+moffs;
                        text = text.slice(0, index) + insert + text.slice(index)
                        moffs += insert.length;
                    }
                    return text;
                };
            } catch {
                // todo: raise error here
                return text => text;
            }
        }
    },
    [ModuleType.InsertBefore]: {
        name: "Insert Before",
        color: "208f40",
        lore: "Insert text before some text",
        description: "Insert a string before each regex match",
        processMaker: (args) => {
            let { insert, after } = args;
            insert = insert ?? "";
            after = after ?? "";
            try {
                let afterRegex = new RegExp(after, 'g')
                return (text) => {
                    let matches = text.matchAll(afterRegex);
                    let moffs = 0;
                    for (let match of matches) {
                        let index = match.index+moffs;
                        text = text.slice(0, index) + insert + text.slice(index);
                        moffs += insert.length;
                    }
                    return text;
                };
            } catch {
                // todo: raise error here
                return text => text;
            }
        }
    },
    [ModuleType.Comment]: {
        name: "Comment",
        color: "757577",
        lore: "This does not modify the text",
        description: "This comment does not modify the text",
        processMaker: (args) => {
            return text => text;
        }
    },
    [ModuleType.ExecutePerLine]: {
        name: "Execute Per Line",
        color: "fbb761",
        lore: "Execute a module for each line",
        description: "Run a module on each line individually and concatenate the results",
        processMaker: (args) => {
            if ( args.moduleType == undefined) {
                // todo: raise error here
                return text => text;
            }
            return (text) => {
                let lineRegex = /(\n|^).*/g;
                let index = 0;
                let allModified = [];
                for (let match of text.matchAll(lineRegex)) {
                    let matchedText = match[0];
                    if (index != 0) {
                        matchedText = matchedText.slice(1)
                    }
                    allModified.push(calculate(matchedText, [args]));
                    index++;
                }
                return allModified.join("\n");
            };
        }
    },
    [ModuleType.ExecutePerFind]: {
        name: "Execute Per Find",
        color: "fbb761",
        lore: "Execute a module for each regex match",
        description: "Run a module on each regex match and replace the original in the text",
        processMaker: (args) => {
            if ( args.moduleType == undefined) {
                // todo: raise error here
                return text => text;
            }
            return (text) => {
                try {
                    let lineRegex = new RegExp(args.regex ?? '.*', 'g')
                    let index = 0;
                    let allModified = [];
                    for (let match of text.matchAll(lineRegex)) {
                        let matchedText = match[0];
                        allModified.push(calculate(matchedText, [args]));
                        index++;
                    }
                    return allModified.join("");
                } catch {
                    // todo: raise error here
                    return text => text
                }
            };
        }
    },
    [ModuleType.ChangeCase]: {
        name: "Change Case",
        color: "fbb761",
        lore: "Change the case of some text",
        description: "Change case of all regex matches to uppercase/lowercase",
        processMaker: (args) => {
            let { regex, newcase } = args;
            regex = regex ?? ".";
            newcase = newcase ?? "keep";
            if (newcase == "keep") {
                return text => text;
            }
            try {
                let regexObj = new RegExp(regex, 'g')
                return (text) => {
                    let matches = text.matchAll(regexObj);
                    text = text.replaceAll(regexObj, (a, x) => {
                        if (newcase == "flip" || newcase == "flipflop") {
                            return a.split('').map((c) => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
                        }
                        if (newcase == "upper") {
                            return a.toUpperCase();
                        }
                        if (newcase == "lower") {
                            return a.toLowerCase();
                        }

                        // todo: raise error here
                        return a;
                    });
                    return text;
                };
            } catch {
                // todo: raise error here
                return text => text;
            }
        }
    },
    [ModuleType.CountLineOccurences]: {
        name: "Count Line Occurences",
        color: "f9cb40",
        lore: "Count the number of occurences of each line",
        description:
            "Count the number of occurences of each line and output it in a specific format",
        processMaker: (args) => {
            let { format } = args;
            format = format ?? "%count% > %text%";
            return (text) => {
                let counted = new Map();
                for (let line of text.split("\n")) {
                    counted.set(line, (counted.get(line) ?? 0) + 1)
                }
                counted = new Map([...counted.entries()].sort((a,b) => "" + (1*b[1]-1*a[1])));
                let texts = [];
                for (let pair of counted) {
                    texts.push(replaceTag("count", pair[1])(replaceTag("line", pair[0])(format)));
                }
                text = texts.join("\n")
                return text;
            }
        }
    },
    [ModuleType.CountMatches]: {
        name: "Count Matches",
        color: "f9cb40",
        lore: "Count number of regex matches",
        description: "Count the number of regex matches and set the text to that number",
        processMaker: (args) => {
            let { regex } = args;
            regex = regex ?? "\n";
            try {
                let regexObj = new RegExp(regex, 'g');
                return (text) => {
                    return "" + (text.match(regexObj) ?? []).length;
                };
            } catch {
                // todo: raise error here
                return (text) => text;
            }
        }
    },
    [ModuleType.CountChars]: {
        name: "Count Chars",
        color: "f9cb40",
        lore: "Count number of chars",
        description: "Count number of chars. Option to exclude chars",
        processMaker: (args) => {
            let { excluded } = args;
            excluded = excluded ?? "";
            return (text) => text.split("").filter(_ => !excluded.includes(_)).join("").length + "";
        }
    },
    [ModuleType.CaptureGroup]: {
        name: "Capture Group",
        color: "f9cb40",
        lore: "Format capture groups in a regex query",
        description: "Format capture groups from regex query. Additionally, specify which capture groups to keep",
        processMaker: (args) => {
            let { regex, format } = args;
            regex = regex ?? "\n";
            format = format ?? "";
            try {
                let regexObj = new RegExp(regex, 'g');
                return (text) => {
                    try {
                        let texts = [];
                        for (let match of text.matchAll(regexObj)) {
                            let formatcopy = format;
                            for (let index in match) {
                                let group = match[index];
                                if (index == 0) {
                                    formatcopy = replaceTag("original", group)(formatcopy);
                                    continue;
                                }
                                formatcopy = replaceTag((index-1) + "", group)(formatcopy);
                            }
                            texts.push(formatcopy);
                        }
                        return texts.join("\n");
                    } catch {
                        return text;
                    }
                }
            } catch {
                // todo: raise error here
                return (text) => text;
            }
        }
    },
    [ModuleType.Hash]: {
        name: "Hash Algorithm",
        color: "f9cb40",
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
    [ModuleType.Reverse]: {
        name: "Reverse",
        color: "fbb761",
        lore: "Reverse the text",
        description: "Reverse the text (qwer -> rewq)",
        processMaker: (args) => (text => text.split('').reverse().join(""))
    },
    [ModuleType.Reflect]: {
        name: "Reflect",
        color: "fbb761",
        lore: "Reflect the text",
        description: "Reflect the text (qwer -> qwerrewq)",
        processMaker: (args) => (text => text + text.split('').reverse().join(""))
    },
    [ModuleType.Caesar]: {
        name: "Caesar Shift",
        color: "fbb771",
        lore: "Shift the text with caesar cipher",
        description: "Shift the text with caesar cipher",
        processMaker: (args) => {
            let { shift } = args;
            shift = shift ?? 0;
            return (text) => {
                if (isNumeric(shift)) {
                    return caesarCipher(text, shift);
                } else {
                    return text;
                }
            }
        }
    },
    [ModuleType.Base64]: {
        name: "Base 64 Encryption",
        color: "fbb771",
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
                    // todo: raise error here
                    return text;
                }
            }
        }
    },
    [ModuleType.CountLines]: {
        name: "Count Lines",
        color: "f9cb40",
        lore: "Count number of lines",
        description: "Count the number of lines (empty string is 1 line)",
        processMaker: (args) => {
            return text => ((text ?? "").split("\n") ?? "").length;
        }
    },
    [ModuleType.CountVowels]: {
        name: "Count Vowels",
        color: "f9cb40",
        lore: "Count number of vowels",
        description: "Count the number of vowels (a,e,i,o,u)",
        processMaker: (args) => {
            return text => (text.match(/[aeiou]/gi) ?? "").length;
        }
    },
    [ModuleType.CountConsonants]: {
        name: "Count Consonants",
        color: "f9cb40",
        lore: "Count number of consonants",
        description: "Count the number of vowels (any that aren't a,e,i,o,u)",
        processMaker: (args) => {
            return text => (text.match(/[^aeiou]/gi) ?? "").length;
        }
    },
    [ModuleType.CountWords]: {
        name: "Count Words",
        color: "f9cb40",
        lore: "Count number of words",
        description: "Count the number of words in the text",
        processMaker: (args) => {
            return text => (text.match(/\w+(?:'\w+)?/g ?? "")).length;
        }
    },
    [ModuleType.Rotate]: {
        name: "Rotate",
        color: "fbb761",
        lore: "Move characters to the other end",
        description: "Loop the characters and offset them. Ex: Qwerty -> wertyQ",
        processMaker: (args) => {
            let { rotate } = args;
            rotate = rotate ?? 0;
            return (text) => {
                try {
                    rotate = rotate*1;
                    if (isNaN(rotate)) {
                        // todo: raise error here

                        return text;
                    }
                    let modded = ((rotate % text.length) + text.length) % text.length
                    return text.substring(modded) + text.substring(0, modded);
                } catch (e) {
                    // todo: raise error here
                    return text;
                }
            }
        }
    }
};

function isNumeric(value) {
    return /^-?\d+$/.test(value);
}

const rgbToHSL = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const l = Math.max(r, g, b);
  const s = l - Math.min(r, g, b);
  const h = s
    ? l === r
      ? (g - b) / s
      : l === g
      ? 2 + (b - r) / s
      : 4 + (r - g) / s
    : 0;
  return [
    60 * h < 0 ? 60 * h + 360 : 60 * h,
    100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
    (100 * (2 * l - s)) / 2,
  ];
};

const hexToRGB = (hex) => {
    let r = 0;
    let g = 0;
    let b = 0;
    let nmap = "0123456789abcdef";
    r += nmap.indexOf(hex[0])*16;
    r += nmap.indexOf(hex[1]);
    g += nmap.indexOf(hex[2])*16;
    g += nmap.indexOf(hex[3]);
    b += nmap.indexOf(hex[4])*16;
    b += nmap.indexOf(hex[5]);
    return [r, g, b];
}

const getHueFromHex = (hex) => {
    return rgbToHSL(...hexToRGB(hex))[0]
}

export function clamp(n, a, b) {
    return Math.min(Math.max(a,n), b);
}

export function sortedModuleTypes() {
    let moduleTypes = Object.values(ModuleType);
    let final = [];
    for (let moduleType of moduleTypes) {
        if (uuidRegex.test(moduleType)) {
            final.push(moduleType);
        }
    }
    return final.sort((a, b) => {
        let acolor = moduleMetadata[a].color;
        let aname = moduleMetadata[a].name;
        let bcolor = moduleMetadata[b].color;
        let bname = moduleMetadata[b].name;
        let hueMod = (getHueFromHex(acolor)-getHueFromHex(bcolor))*10;
        return hueMod + aname.localeCompare(bname);
    });
}

let bundledFunctions = [sha256, md5, caesarCipher, isNumeric];

export function calculate(text, modules=undefined) {
    if (modules == undefined) {
        modules = get(recipeModules);
    }
    let recipe = [];

    if (text == null) {
        text = "";
    }

    for (let modul of modules) {
        let argumens = {...modul.args}
        for (let arg of Object.keys(argumens)) {
            if (typeof argumens[arg] == 'string') {
                argumens[arg] = argumens[arg].replaceAll(notBackslashedRegex("\\\\n"), "\n");
            }
        }
        let convert = moduleMetadata[modul.moduleType].processMaker(argumens);
        recipe.push([modul.args, moduleMetadata[modul.moduleType].processMaker]);
        text = convert(text);
    }

    let customJs = "";

    for (let step of recipe) {
        customJs += `_inp_text = (${String(step[1])})(${JSON.stringify(step[0])})(_inp_text);`;
    }

    let bundledTexts = bundledFunctions.join("\n");

    customJs = `function formatText(_inp_text) {
    ${bundledTexts}
    ${customJs}
    return _inp_text;
}`;

    return get(outputAsJs) ? customJs : text;
}

function notBackslashedRegex(r) {
    return new RegExp(`(?<!\\\\)${r}`, 'g')
}

export { moduleMetadata };
