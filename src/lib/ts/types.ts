import { recipeModules } from './stores'
import { get } from "svelte/store"

// change when new module:
import AppendModule from "../modules/AppendModule.svelte";
import InsertModule from "../modules/InsertModule.svelte";
import RemoveModule from "../modules/RemoveModule.svelte";
import ReplaceModule from "../modules/ReplaceModule.svelte";
import RandomCaseModule from "../modules/RandomCaseModule.svelte";
import InsertAfterModule from "../modules/InsertAfterModule.svelte";
import InsertBeforeModule from "../modules/InsertBeforeModule.svelte";
import CommentModule from "../modules/CommentModule.svelte";
import ExecutePerLineModule from "../modules/ExecutePerLineModule.svelte";

// random string thing
function rst(): string {
    return crypto.randomUUID();
}

export enum ModuleType {
    Append = rst(),
    Replace = rst(),
    Remove = rst(),
    Insert = rst(),
    RandomCase = rst(),
    InsertAfter = rst(),
    InsertBefore = rst(),
    Comment = rst(),
    ExecutePerLine = rst()
}

export const moduleMap = {
    [ModuleType.Append]: AppendModule,
    [ModuleType.Replace]: ReplaceModule,
    [ModuleType.Remove]: RemoveModule,
    [ModuleType.Insert]: InsertModule,
    [ModuleType.RandomCase]: RandomCaseModule,
    [ModuleType.InsertAfter]: InsertAfterModule,
    [ModuleType.InsertBefore]: InsertBeforeModule,
    [ModuleType.Comment]: CommentModule,
    [ModuleType.ExecutePerLine]: ExecutePerLineModule
};

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
            return (text) => {
                let lineRegex = /(\n|^).*/g;
                let index = 0;
                let allModified = [];
                for (let match of text.matchAll(lineRegex)) {
                    let matchedText = match[0];
                    if (index != 0) {
                        matchedText = matchedText.slice(1)
                    }
                    allModified.push(matchedText);
                    index++;
                }
                return allModified.join("\n");
            };
        }
    }
};

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

export let uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/g;

export function calculate(text, ascode=false) {
    let modules = get(recipeModules);
    let recipe = [];

    for (let modul of modules) {
        let argumens = {...modul.args}
        for (let arg of Object.keys(argumens)) {
            argumens[arg] = argumens[arg].replaceAll(/(?<!\\)\\n/g, "\n");
        }
        let convert = moduleMetadata[modul.moduleType].processMaker(argumens);
        recipe.push([modul.args, moduleMetadata[modul.moduleType].processMaker]);
        text = convert(text);
    }

    let customJs = "";

    for (let step of recipe) {
        customJs += `_inp_text = (${String(step[1])})(${JSON.stringify(step[0])})(_inp_text);`;
    }

    customJs = `function formatText(_inp_text) {
    ${customJs}
    return _inp_text;
}`;

    return get(ascode) ? customJs : text;
}

export { moduleMetadata };
