import { writable, get } from 'svelte/store';
import { moduleMetadata, ModuleType } from "./master.ts";

export const recipeModules = writable([]);
export const outputAsJs = writable(false);
