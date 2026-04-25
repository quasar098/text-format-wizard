import { writable, get } from 'svelte/store';
import type { Writable } from "svelte/store";
import { moduleMetadata } from "./master.ts";
import { ModuleType } from "./module.ts";


async function loadModulesFromFragment() {
    let encodedFragment = window.location.hash.substr(1);
    if (encodedFragment.length == 0) {
        return [];
    }
    try {
        let atobed = atob(encodedFragment);
        let bytes = new Uint8Array(Array.from(atobed).map(c => c.charCodeAt(0)));
        let blob = new Blob([bytes], { type: "application/octet-stream" });
        let decompressedStream = blob.stream().pipeThrough(new DecompressionStream("deflate-raw"));
        let decompressed = await (await new Response(decompressedStream).blob()).text();
        let decodedFragment = JSON.parse(decompressed);
        if (Array.isArray(decodedFragment)) {
            return decodedFragment;
        } else {
            if (Array.isArray(decodedFragment.recipe)) {
                return decodedFragment.recipe;
            }
            return [];
        }
    } catch {
        try {
            let decodedFragment = JSON.parse(atob(encodedFragment));
            if (Array.isArray(decodedFragment)) {
                return decodedFragment;
            } else {
                if (Array.isArray(decodedFragment.recipe)) {
                    return decodedFragment.recipe;
                }
                return [];
            }
        } catch {
            return [];
        }
    }
}


export const lastInputText: Writable<string> = writable("");
export const moduleFrameFilter: Writable<string> = writable("");

export const recipeModules: Writable<Array<any>> = writable(await loadModulesFromFragment());
export const outputAsJs: Writable<boolean> = writable(false);

export const hasLoadedAllModules: Writeable<boolean> = writable(false);

export const colorTheme: Writable<number> = writable(1*(localStorage.getItem("tfwColorTheme") ?? 0));
colorTheme.subscribe((newColorTheme) => {
    localStorage.setItem("tfwColorTheme", newColorTheme ?? 0);
});
