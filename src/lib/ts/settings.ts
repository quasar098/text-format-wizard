import type { Writable } from "svelte/store";
import { writable, get } from 'svelte/store';


export enum Setting {
    ShowLeaveWarning,
    ModuleQuickFinderKeybind,
    CalculatorKeybind,
    CopyRecipeURLKeybind,
    ClearAllModulesKeybind,
    SettingsKeybind,
    IncludeInputOnCopyRecipeUrl
}


let parsedSettings: {[key: Setting]: any} = {};
try {
    parsedSettings = JSON.parse(localStorage.getItem("tfwSettings"));
} catch {}

const settings: Writable<{[key: Setting]: any}> = writable(parsedSettings ?? {});
settings.subscribe((newSettings) => {
    localStorage.setItem("tfwSettings", JSON.stringify(newSettings));
})

export let settingDefaults: {[key: Setting]: {[key: string]: string | boolean} | boolean} = {
    [Setting.SettingsKeybind]: {
        ctrl: false, alt: true, shift: true, code: "Digit0"
    },
    [Setting.ModuleQuickFinderKeybind]: {
        ctrl: true, alt: false, shift: true, code: "KeyP"
    },
    [Setting.CalculatorKeybind]: {
        ctrl: true, alt: false, shift: true, code: "KeyU"
    },
    [Setting.CopyRecipeURLKeybind]: {
        ctrl: true, alt: false, shift: true, code: "KeyL"
    },
    [Setting.ClearAllModulesKeybind]: {
        ctrl: true, alt: false, shift: true, code: "KeyD"
    },
    [Setting.ShowLeaveWarning]: true,
    [Setting.IncludeInputOnCopyRecipeUrl]: true
}


export function setSetting(name: Setting, value: any): void {
    settings.update((settedSettings) => {
        settedSettings[Setting[name]] = value;
        return settedSettings;
    });
}


export function getSetting(name: Setting): any {
    if (!Object.keys(get(settings)).includes(Setting[name])) {
        setSetting(name, settingDefaults[name]);
    }
    return get(settings)[Setting[name]];
}


export function checkKeybind(event: any, keybindSetting: Setting): any {
    let keybind: {[key: string]: string | boolean} | undefined = getSetting(keybindSetting);
    if (keybind === undefined) {
        return false;
    }
    if (keybind.ctrl !== event.ctrlKey) {
        return false;
    }
    if (keybind.shift !== event.shiftKey) {
        return false;
    }
    if (keybind.alt !== event.altKey) {
        return false;
    }
    return keybind.code === event.code;
}
