import { recipeModules } from './stores'
import { get } from "svelte/store"

// change when new module:
import AppendModule from "../modules/AppendModule.svelte";
import InsertModule from "../modules/InsertModule.svelte";
import RemoveModule from "../modules/RemoveModule.svelte";
import ReplaceModule from "../modules/ReplaceModule.svelte";
import RandomCaseModule from "../modules/RandomCaseModule.svelte";

// random string thing
function rst(): string {
    return crypto.randomUUID();
}

export enum ModuleType {
    Append = rst(),
    Replace = rst(),
    Remove = rst(),
    Insert = rst(),
    RandomCase = rst()
}

export const moduleMap = {
    [ModuleType.Append]: AppendModule,
    [ModuleType.Replace]: ReplaceModule,
    [ModuleType.Remove]: RemoveModule,
    [ModuleType.Insert]: InsertModule,
    [ModuleType.RandomCase]: RandomCaseModule
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
        description: "Find matches of regex and replace those matches with another text",
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
    }
};

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
