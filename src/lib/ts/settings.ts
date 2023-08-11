import type { Writable } from "svelte/store";
import { writable, get } from 'svelte/store';

const settings: Writable<{[key: string]: any}> = writable({});


export function setSetting(name: string, value: any): void {
    settings[name] = value;
}


export function getSetting(name: string, defaultValue: any): any {
    if (!Object.keys(get(settings)).includes(name)) {
        settings[name] = defaultValue;
    }
    return settings[name];
}
