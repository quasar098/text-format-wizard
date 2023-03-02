import { writable, get } from 'svelte/store';
import { moduleMetadata, ModuleType } from "./types.ts";

export const recipeModules = writable([]);
export const outputAsJs = writable(false);
