import type { Writable } from "svelte/store";
import { writable, get } from 'svelte/store';

export const settings: Writable<{[key: string]: any}> = writable({});
