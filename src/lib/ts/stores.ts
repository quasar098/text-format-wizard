import { writable, get } from 'svelte/store';
import type { Writable } from "svelte/store";
import { moduleMetadata } from "./master.ts";
import { ModuleType } from "./modules/types.ts";
import { TooltipIcon } from "./tooltip.ts";
import type { TooltipType } from "./tooltip.ts";

export const recipeModules = writable([]);
export const outputAsJs: Writable<boolean> = writable(false);

export const showFindModuleModal: Writable<boolean> = writable(false);

export const showAddModuleModal: Writable<boolean> = writable(false);
export const addModuleModalInfo = writable(undefined);

export const tooltipStack: Writable<Array<TooltipType>> = writable([]);

export const colorTheme: Writable<number> = writable(1*(localStorage.getItem("tfwColorTheme") ?? 0));
colorTheme.subscribe(newColorTheme => {
    localStorage.setItem("tfwColorTheme", newColorTheme ?? 0);
})
