import { writable, get } from 'svelte/store';
import { moduleMetadata, ModuleType } from "./types.ts";

export const recipeModules = writable([]);

export function calculate(text) {
    let modules = get(recipeModules);
    let total = [];

    for (let modul of modules) {
        let convert = moduleMetadata[modul.moduleType].processMaker(modul.args);
        total.push([modul.args, moduleMetadata[modul.moduleType].processMaker]);
        text = convert(text);
    }

    let customJs = "";
    console.log(customJs);
    return text;
}
