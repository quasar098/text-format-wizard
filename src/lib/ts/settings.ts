import type { Writable } from "svelte/store";
import { writable, get } from 'svelte/store';


export enum Setting {
    ShowLeaveWarning
}


let parsedSettings: {[key: Setting]: any} = {};
try {
    parsedSettings = JSON.parse(localStorage.getItem("tfwSettings"));
} catch {}

const settings: Writable<{[key: Setting]: any}> = writable(parsedSettings ?? {});
settings.subscribe((newSettings) => {
    localStorage.setItem("tfwSettings", JSON.stringify(newSettings));
})


export function setSetting(name: Setting, value: any): void {
    settings.update((settedSettings) => {
        settedSettings[Setting[name]] = value;
        return settedSettings;
    });
}


export function getSetting(name: Setting, defaultValue: any): any {
    if (!Object.keys(get(settings)).includes(Setting[name])) {
        setSetting(name, defaultValue);
    }
    return get(settings)[Setting[name]];
}
