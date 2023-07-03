import { recipeModules, outputAsJs, tooltipStack } from './stores'
import { get } from "svelte/store"
import { md5 } from "./md5.ts";
import { caesarCipher } from "./caesar.ts";
import { sha256 } from "./sha256.ts"
import { v5 as uuidv5 } from 'uuid';
import { ModuleType, moduleColor, showWarning, WARNING_UUID } from "./modules/types.ts";
import { moduleMetadata as encodingModules } from './modules/encoding.ts';
import { moduleMetadata as genericModules } from './modules/generic.ts';
import { moduleMetadata as miscModules } from './modules/misc.ts';

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
                    showWarning(`Evaluation error at JTR Mask Module`);
                    return text;
                }
            };
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
    [ModuleType.Reset]: {
        name: "Reset",
        color: moduleColor.logic,
        lore: "Clear the text",
        description: "Very computationally efficient way to clear the text",
        processMaker: (args) => ((text) => "")
    }
};

let externalModules = [
    encodingModules,
    miscModules,
    genericModules
];

for (var externalModuleIndex in externalModules) {
    let exm = externalModules[externalModuleIndex];
    for (var moduleUUID in exm) {
        moduleMetadata[moduleUUID] = exm[moduleUUID];
    }
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
