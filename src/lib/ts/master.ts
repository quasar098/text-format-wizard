import { recipeModules, outputAsJs, tooltipStack } from './stores'
import { get } from "svelte/store"
import { md5 } from "./md5.ts";
import { caesarCipher } from "./caesar.ts";
import { sha256 } from "./sha256.ts"
import { genTooltip } from "./tooltip.ts"
import { v5 as uuidv5 } from 'uuid';
import { ModuleType, moduleColor } from "./modules/types.ts";
import { moduleMetadata as encodingModules } from './modules/encoding.ts';

export let uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/g;


export let loopingModuleIndexStack = [];

// the best things
function replaceTag(k,v) {
    if (typeof v == "function") {
        return ((text) => {
            return text.replaceAll(new RegExp(`(?<!\\\\)%${k}%`,'g'), (...result) => v(...result)).replaceAll(`\\%${k}%`, `%${k}%`);
        })
    }
    return ((text) => {
        return text.replaceAll(new RegExp(`(?<!\\\\)%${k}%`,'g'), v).replaceAll(`\\%${k}%`, `%${k}%`);
    });
}

function replaceTagWithArgs(tag, argNumber) {
    // todo: do this maybe
}

let moduleMap_ = {};

let numLoaded = 0;

(() => {
    for (let mType_ of Object.keys(ModuleType)) {
        if (!uuidRegex.test(ModuleType[mType_])) {
            moduleMap_[mType_] = undefined;
            import(`../modules/${ModuleType[mType_]}Module.svelte`).then(mod => {
                moduleMap_[mType_] = mod.default;
                numLoaded += 1;
                if (numLoaded == Object.keys(moduleMap_).length) {
                    console.log("Finished loading all modules");
                }
            })
        }
    }
})()

export const moduleMap = moduleMap_;

let moduleMetadata = {
    [ModuleType.WordlistMask]: {
        name: "Wordlist Mask",
        color: moduleColor.pwcrack,
        lore: "Emulate John the Ripper masks but slightly different",
        description: "Expand different possibilities for password cracking wordlists and other utilities",
        processMaker: (args) => {
            let { mask } = args;
            mask = mask ?? "?w";
            return (text) => {
                try {
                    let splitted = [];
                    mask.replaceAll(/([^?]+|\?.)/g, (m) => {
                        splitted.push(m);
                    });
                    let intermediates = [];
                    for (let newton of splitted) {
                        if (!newton.length) {
                            continue;
                        }
                        if (newton[0] == "?") {
                            let loose = newton[1].toLowerCase() == newton[1];
                            newton = newton[0] + newton[1].toLowerCase();
                            // todo: switch-case instead
                            if (newton[1] == "?") {
                                intermediates.push({type: "questionmark", options: ["?"], count: 0});
                            } else if (newton[1] == "w") {
                                intermediates.push({type: "originalword", options: text.split("\n"), count: 0});
                            } else if (newton[1] == "d") {
                                intermediates.push({type: "digit", options: "0123456789".split(""), count: 0});
                            } else if (newton[1] == "l") {
                                intermediates.push({type: "lowerletter", options: "abcdefghijklmnopqrstuvwxyz".split(""), count: 0});
                            } else if (newton[1] == "s") {
                                intermediates.push({type: "special", options: "!@#$%^&*()[]{}<>,.?/\\|+_=-~`\"';:".split(""), count: 0});
                            } else if (newton[1] == "u") {
                                intermediates.push({type: "upperletter", options: "abcdefghijklmnopqrstuvwxyz".toUpperCase().split(""), count: 0});
                            } else if (newton[1] == "a") {
                                intermediates.push({type: "alphanum", options: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split(""), count: 0});
                            } else {
                                continue;
                            }
                            if (loose) {
                                if (newton[1].toUpperCase() != newton[1].toLowerCase()) {
                                    intermediates[intermediates.length-1].options.push("");
                                }
                            }
                        } else {
                            intermediates.push({type: "newton", options: [newton], count: 0});
                        }
                    }
                    let possible = [];
                    let times = 0;
                    while (true) {
                        let newPossible = "";
                        for (let intermediate of intermediates) {
                            // this should prevent numbers from showing up
                            newPossible += (intermediate.options[intermediate.count]).toString(10);
                        }
                        possible.push(newPossible);
                        for (let intermediate of intermediates) {
                            let intermax = intermediate.options.length;
                            if (intermediate.count++ >= intermax-1) {
                                intermediate.count = 0;
                                continue;
                            }
                            break;
                        }
                        winner: {
                            for (let intermediate of intermediates) {
                                if (intermediate.count != 0) {
                                    break winner;
                                }
                            }
                            return possible.join("\n");
                        }
                        // this is necessary (the number, not the restriction), trust me
                        if (times++ > 6942069) {
                            showWarning("Looping too long at JTR Mask Module")
                            return text;
                        }
                    }
                    showWarning("Cannot escape while loop at JTR Mask Module");
                    return text;
                } catch (e) {
                    console.log(e);
                    showWarning(`Evaluation error at JTR Mask Module`);
                    return text;
                }
            };
        }
    },
    [ModuleType.Remove]: {
        name: "Regex Remove",
        color: moduleColor.generic,
        lore: "Remove any matches of regex",
        description: "Find matches of regex and remove them from the text",
        processMaker: (args) => {
            let { remove } = args;
            remove = remove ?? "";
            try {
                let regexp = new RegExp(remove, 'g')
                return (text) => { return text.replaceAll(regexp, '') }
            } catch {
                showWarning(`Invalid regex at Remove module`);
                return text => text;
            }
        }
    },
    [ModuleType.RandomLine]: {
        name: "Random Line",
        color: moduleColor.misc,
        lore: "Random line chooser",
        description: "Simple",
        processMaker: (args) => {
            let { method } = args;
            return (text) => {
                let lines = text.split("\n");
                let index = Math.floor(Math.random()*lines.length);
                return lines[index];
            }
        }
    },
    [ModuleType.RemoveBlankLines]: {
        name: "Remove Blank Lines",
        color: moduleColor.generic,
        lore: "Self explanatory",
        description: "Self explanatory",
        processMaker: (args) => {
            return text => text.split("\n").filter(_ => _ != '').join("\n");
        }
    },
    [ModuleType.Replace]: {
        name: "Regex Replace",
        color: moduleColor.generic,
        lore: "Replace any matches of regex",
        description: "Find matches of regex and replace each of those matches with another format",
        processMaker: (args) => {
            let { remove, format } = args;
            remove = remove ?? "";
            format = format ?? "";
            try {
                let regexp = new RegExp(remove, 'g')
                return (text) => {
                    return text.replaceAll(regexp, (...match) => {
                        let formatcopy = format;
                        match = match.slice(0, -2);
                        for (var index = 0; index < match.length; index++) {
                            let group = match[index];
                            if (index == 0) {
                                formatcopy = replaceTag("original", group)(formatcopy);
                                continue;
                            }
                            formatcopy = replaceTag((index-1) + "", group)(formatcopy);
                        }
                        return formatcopy;
                    })
                }
            } catch (e) {
                showWarning(`Error with Regex Replace module: ${e}`);
                return text => text;
            }
        }
    },
    [ModuleType.Append]: {
        name: "Append",
        color: moduleColor.misc,
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
        color: moduleColor.misc,
        lore: "Insert text at a specific index",
        description: "Insert text at a specific index in the text. Will not replace text.",
        processMaker: (args) => {
            let { insert, index } = args;
            insert = insert ?? "";
            index = index ?? 0;
            if (isNaN(parseInt(index))) {
                showWarning(`Invalid index for Insert module`);
                return text => text;
            }
            index = parseInt(index);
            return (text) => text.slice(0, index) + insert + text.slice(index)
        }
    },
    [ModuleType.InsertAfter]: {
        name: "Insert After",
        color: moduleColor.misc,
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
                showWarning(`Invalid Regex at Insert After module`);
                return text => text;
            }
        }
    },
    [ModuleType.InsertBefore]: {
        name: "Insert Before",
        color: moduleColor.misc,
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
                showWarning(`Invalid Regex at Insert Before module`);
                return text => text;
            }
        }
    },
    [ModuleType.Comment]: {
        name: "Comment",
        color: moduleColor.comment,
        lore: "This does not modify the text",
        description: "This comment does not modify the text",
        processMaker: (args) => {
            return text => text;
        }
    },
    [ModuleType.ExecutePerLine]: {
        name: "Execute Per Line",
        color: moduleColor.logic,
        lore: "Execute a module for each line",
        description: "Run a module on each line individually and concatenate the results",
        processMaker: (args) => {
            if (args.moduleType == undefined) {
                showWarning(`Please select a module`);
                return text => text;
            }
            return (text) => {
                let index = 0;
                let indexStackIndex = loopingModuleIndexStack.length;
                loopingModuleIndexStack.push({index: 0});
                let allModified = [];
                for (let match of text.split("\n")) {
                    allModified.push(calculate(match, [args]));
                    index++;
                    loopingModuleIndexStack[indexStackIndex].index = index;
                }
                loopingModuleIndexStack.pop();
                return allModified.join("\n");
            };
        }
    },
    [ModuleType.ExecutePerFind]: {
        name: "Execute Per Find",
        color: moduleColor.logic,
        lore: "Execute a module for each regex match",
        description: "Run a module on each regex match and replace the original in the text",
        processMaker: (args) => {
            if (args.moduleType == undefined) {
                showWarning(`Please select a module`);
                return text => text;
            }
            return (text) => {
                try {
                    let findRegex = new RegExp(args.regex ?? '.*', 'g')
                    let index = 0;
                    let indexStackIndex = loopingModuleIndexStack.length;
                    loopingModuleIndexStack.push({index: 0});
                    let _ = text.replaceAll(findRegex, (a) => {
                        index++;
                        loopingModuleIndexStack[indexStackIndex].index = index-1;
                        return calculate(a, [args]);
                    });
                    loopingModuleIndexStack.pop();
                    return _;
                } catch (e) {
                    showWarning(`Invalid Regex at Execute Per Find module: ${e}`);
                    return text => text
                }
            };
        }
    },
    [ModuleType.SumDigits]: {
        name: "Sum Digits",
        color: moduleColor.misc,
        lore: "Sum the digits of an number",
        description: "Sum the digits of an number. Does not work on scientific notation. Outputs undefined on error",
        processMaker: (args) => {
            return (text) => {
                try {
                    if (isNaN(text*1)) {
                        showWarning("Error at Sum Digits module");
                        return "undefined";
                    }
                    return text.toString().split("").map(Number).reduce((a, b) => {return a+b}, 0);
                } catch {
                    showWarning("Error at Sum Digits module");
                    return "undefined";
                }
            }
        }
    },
    [ModuleType.ChangeCase]: {
        name: "Change Case",
        color: moduleColor.misc,
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
                    text = text.replaceAll(regexObj, (a) => {
                        if (newcase == "flip" || newcase == "flipflop") {
                            return a.split('').map((c) => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
                        }
                        if (newcase == "upper") {
                            return a.toUpperCase();
                        }
                        if (newcase == "lower") {
                            return a.toLowerCase();
                        }
                        if (newcase == "random") {
                            let newText = "";
                            for (let letter of a) {
                                newText += Math.random() > 0.5 ? letter.toUpperCase() : letter.toLowerCase();
                            }
                            return newText;
                        }

                        showWarning(`Something went wrong with Change Case module`);
                        return a;
                    });
                    return text;
                };
            } catch (e) {
                showWarning(`Error at Change Case module: ${e}`);
                return text => text;
            }
        }
    },
    [ModuleType.CountLineOccurences]: {
        name: "Count Line Occurences",
        color: moduleColor.generic,
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
        color: moduleColor.generic,
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
                showWarning(`Invalid Regex at Count Matches Module`);
                return (text) => text;
            }
        }
    },
    [ModuleType.CountChars]: {
        name: "Count Chars",
        color: moduleColor.generic,
        lore: "Count number of chars",
        description: "Count number of chars. Option to exclude chars",
        processMaker: (args) => {
            let { excluded } = args;
            excluded = excluded ?? "";
            return (text) => text.split("").filter(_ => !excluded.includes(_)).join("").length + "";
        }
    },
    [ModuleType.KeepRegex]: {
        name: "Keep Regex",
        color: moduleColor.generic,
        lore: "Keep Regex matches and format them too",
        description: "Only keep matches of regex and list them out",
        keywords: "Capture Group",
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
                            for (var index = 0; index < match.length; index++) {
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
                    } catch (e) {
                        showWarning(`Error with Keep Regex Module: ${e}`);
                        return text;
                    }
                }
            } catch (e) {
                showWarning(`Error with Keep Regex Module: ${e}`);
                return (text) => text;
            }
        }
    },
    [ModuleType.Reverse]: {
        name: "Reverse",
        color: moduleColor.misc,
        lore: "Reverse the text",
        description: "Reverse the text (qwer -> rewq)",
        processMaker: (args) => (text => text.split('').reverse().join(""))
    },
    [ModuleType.Reflect]: {
        name: "Reflect",
        color: moduleColor.misc,
        lore: "Reflect the text",
        description: "Reflect the text (qwer -> qwerrewq)",
        processMaker: (args) => (text => text + text.split('').reverse().join(""))
    },
    [ModuleType.CountLines]: {
        name: "Count Lines",
        color: moduleColor.generic,
        lore: "Count number of lines",
        description: "Count the number of lines (empty string is 1 line)",
        processMaker: (args) => {
            return text => ((text ?? "").split("\n") ?? "").length;
        }
    },
    [ModuleType.CountVowels]: {
        name: "Count Vowels",
        color: moduleColor.generic,
        lore: "Count number of vowels",
        description: "Count the number of vowels (a,e,i,o,u)",
        processMaker: (args) => {
            return text => (text.match(/[aeiou]/gi) ?? "").length;
        }
    },
    [ModuleType.CountConsonants]: {
        name: "Count Consonants",
        color: moduleColor.generic,
        lore: "Count number of consonants",
        description: "Count the number of vowels (any that aren't a,e,i,o,u)",
        processMaker: (args) => {
            return text => (text.match(/[^aeiou]/gi) ?? "").length;
        }
    },
    [ModuleType.CountWords]: {
        name: "Count Words",
        color: moduleColor.generic,
        lore: "Count number of words",
        description: "Count the number of words in the text",
        processMaker: (args) => {
            return text => (text.match(/\w+(?:'\w+)?/g) ?? "").length;
        }
    },
    [ModuleType.Rotate]: {
        name: "Rotate",
        color: moduleColor.misc,
        lore: "Move characters to the other end",
        description: "Loop the characters and offset them. Ex: Qwerty -> wertyQ",
        processMaker: (args) => {
            let { rotate } = args;
            rotate = rotate ?? 0;
            return (text) => {
                try {
                    rotate = rotate*1;
                    if (isNaN(rotate)) {
                        showWarning(`Rotate Module takes a number`);

                        return text;
                    }
                    let modded = ((rotate % text.length) + text.length) % text.length
                    return text.substring(modded) + text.substring(0, modded);
                } catch (e) {
                    showWarning(`Rotate Module Error: ${e}`)
                    return text;
                }
            }
        }
    },
    [ModuleType.Duplicate]: {
        name: "Duplicate",
        color: moduleColor.misc,
        lore: "Duplicate the text some number of times",
        description: "Duplicate the text a few times",
        processMaker: (args) => {
            let { amount } = args;
            amount = amount ?? 0;
            return (text) => {
                try {
                    if (amount == "") {
                        showWarning("Duplicate Module is missing the argument");
                        return text;
                    }
                    amount = amount*1;
                    if (isNaN(amount)) {
                        showWarning("Duplicate Module takes a number");

                        return text;
                    }
                    return text.repeat(amount);
                } catch (e) {
                    showWarning(`Duplicate Module Error: ${e}`);
                    return text;
                }
            }
        }
    },
    [ModuleType.Reset]: {
        name: "Reset",
        color: moduleColor.logic,
        lore: "Clear the text",
        description: "Very computationally efficient way to clear the text",
        processMaker: (args) => ((text) => "")
    }
};

let externalModules = [
    encodingModules
];

for (var externalModuleIndex in externalModules) {
    let exm = externalModules[externalModuleIndex];
    for (var moduleUUID in exm) {
        moduleMetadata[moduleUUID] = exm[moduleUUID];
    }
}

function showWarning(message) {
    tooltipStack.update((stack) => {
        stack.splice(0, 0, genTooltip(message, "Warning", WARNING_UUID));
        return stack;
    })
}

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

// %rand% -> 0 or 1
// %rand(max)% -> 0...max-1 inclusive
// %rand(min, max)% -> min...max-1 inclusive
let replaceRand = replaceTag("rand(?:\\((?:([\\d]+(?:\\.[\\d]+)?)(?:,([\\d]+(?:\\.[\\d]+)?))?)?\\))?", (...args) => {
    let first = args[1];
    let second = args[2];
    if (first == undefined) {
        return Math.floor(Math.random()*2);
    }
    if (second == undefined) {
        return Math.floor(Math.random()*(first*1+1));
    }
    return Math.floor(Math.random()*(second*1-first*1+1))+first*1;
});

// %choose(chars)% -> random char from chars. ) and , chars can be escaped to be inserted
let replaceChoose = replaceTag("choose(?:\\((?:((?:(?<=\\\\)(?:.)|[^,)])+))\\))", (...args) => {
    // kinda jank ngl
    let possible = args[1].replaceAll(/\\(.)/g, (_,c) => c);
    return possible[Math.floor(Math.random()*possible.length)];
})

let bundledFunctions = [replaceTag, replaceRand, caesarCipher, isNumeric];
const WARNING_UUID = "01234567-0123-0123-1337-694204206969";

export function calculate(text, modules=undefined) {
    tooltipStack.update((stack) => {
        // interesting...
        stack = stack.filter(_ => _.uuid != WARNING_UUID);
        return stack;
    })

    if (modules == undefined) {
        loopingModuleIndexStack = [];
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
                argumens[arg] = argumens[arg].replaceAll(notBackslashedRegex("\\\\t"), "\t");
                argumens[arg] = replaceRand(argumens[arg]);
                argumens[arg] = replaceChoose(argumens[arg]);
                for (let obji in loopingModuleIndexStack) {
                    let obj = loopingModuleIndexStack[obji]
                    argumens[arg] = replaceTag(`i${obji}`, obj.index)(argumens[arg]);
                }
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

    let bundledTexts = bundledFunctions.join(";\n");

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
