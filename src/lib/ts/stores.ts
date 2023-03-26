import { writable, get } from 'svelte/store';
import type { Writable } from "svelte/store";
import { moduleMetadata, ModuleType } from "./master.ts";
import { TooltipIcon } from "./tooltip.ts";
import type { TooltipType } from "./tooltip.ts";

export const recipeModules = writable([]);
export const outputAsJs: Writable<boolean> = writable(false);

export const showFindModuleModal: Writable<boolean> = writable(false);

export const showAddModuleModal: Writable<boolean> = writable(false);
export const addModuleModalInfo = writable(undefined);

export const tooltipStack: Writable<Array<TooltipType>> = writable([]);
