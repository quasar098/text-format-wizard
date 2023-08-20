import { recipeModules, outputAsJs, hasLoadedAllModules } from './stores.ts'
import { get } from "svelte/store"
import { v5 as uuidv5 } from 'uuid';
import { ModuleType, moduleColor, replaceTag } from "./module.ts";
import { showWarning, showError, filterTooltipStack, WARNING_UUID } from './tooltip.ts';
import { moduleMetadata as encodingModules } from './modules/encoding.ts';
import { moduleMetadata as genericModules } from './modules/generic.ts';
import { moduleMetadata as ctfModules } from './modules/ctf.ts';
import { moduleMetadata as miscModules } from './modules/misc.ts';

export let uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/g;


export let loopingModuleIndexStack = [];
let registerDB = {};

let moduleMap_ = {};

// load all module components
let numModuleComponentsLoaded = 0;
(async () => {
    for (let mType_ of Object.keys(ModuleType)) {
        if (!uuidRegex.test(ModuleType[mType_])) {
            moduleMap_[mType_] = undefined;
            import(`../modules/${ModuleType[mType_]}Module.svelte`).then(mod => {
                moduleMap_[mType_] = mod.default;
                numModuleComponentsLoaded += 1;
                if (numModuleComponentsLoaded == Object.keys(moduleMap_).length) {
                    console.log("Finished loading all modules");
                    hasLoadedAllModules.update(() => true);
                }
            })
        }
    }
})()

export const moduleMap = moduleMap_;

let moduleMetadata = {
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
    },
    [ModuleType.Store]: {
        name: "Store",
        color: moduleColor.logic,
        lore: "Store current text in register",
        description: "Can be accessed using %v<name>%",
        processMaker: (args) => {
            let { name } = args;
            if (name == undefined) {
                showWarning("Register cannot have blank name");
                return (text) => text;
            }
            return (text) => {
                if (name.length !== 0) {
                    registerDB[name] = text;
                }
                return text;
            }
        }
    }
};

let externalModules = [
    encodingModules,
    miscModules,
    genericModules,
    ctfModules
];

for (var externalModuleIndex in externalModules) {
    let exm = externalModules[externalModuleIndex];
    for (var moduleUUID in exm) {
        moduleMetadata[moduleUUID] = exm[moduleUUID];
    }
}

const rgbToHSL = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const l = Math.max(r, g, b);
    const s = l - Math.min(r, g, b);
    const h = s ? l === r ? (g - b) / s : l === g ? 2 + (b - r) / s : 4 + (r - g) / s : 0;
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
        if (moduleMetadata[a] === undefined) {
            throw new Error(`module is undefined: ${a}`);
        }
        if (moduleMetadata[b] === undefined) {
            throw new Error(`module is undefined: ${b}`);
        }
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

let bundledFunctions = [replaceTag, replaceRand];

export function calculate(text, modules=undefined) {
    filterTooltipStack(_ => _.uuid != WARNING_UUID);

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
                for (let regn in registerDB) {
                    let regv = registerDB[regn];
                    argumens[arg] = replaceTag(`v${regn}`, regv)(argumens[arg]);
                }
            }
        }
        try {
            let convert = moduleMetadata[modul.moduleType].processMaker(argumens);
            recipe.push([modul.args, moduleMetadata[modul.moduleType].processMaker]);
            text = convert(text)+[];  // adding a list is really cursed ngl
        } catch (critical) {
            text = text;
            showError(`Critical: ${critical}`);
            console.log(critical);
        }
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
