import { writable, get } from 'svelte/store';
import type { Writable } from "svelte/store";
import { moduleMetadata } from "./master.ts";
import { ModuleType } from "./module.ts";


function loadModulesFromFragment() {
    let encodedFragment = window.location.hash.substr(1);
    if (encodedFragment.length == 0) {
        return [];
    }
    try {
        let decodedFragment = JSON.parse(atob(encodedFragment));
        return decodedFragment;
    } catch {
        return [];
    }
}



export const moduleFrameFilter: Writable<string> = writable("");

export const recipeModules: Writable<Array<any>> = writable(loadModulesFromFragment());
export const outputAsJs: Writable<boolean> = writable(false);

export const hasLoadedAllModules: Writeable<boolean> = writable(false);

export const colorTheme: Writable<number> = writable(1*(localStorage.getItem("tfwColorTheme") ?? 0));
colorTheme.subscribe(newColorTheme => {
    localStorage.setItem("tfwColorTheme", newColorTheme ?? 0);
});
