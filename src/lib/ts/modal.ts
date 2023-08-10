import { writable, get } from 'svelte/store';
import type { Writable } from "svelte/store";


type WindowType = {
    id: number;
    info: any;
}


export function openWindow(wid: number, info?: any): boolean {
    /* opens a window if it's not already open */
    let windowIsOpenedAlready: boolean = false;
    get(windowStack).forEach((windowObject) => {
        if (windowObject.id == wid) {
            windowIsOpenedAlready = true;
        }
    });
    if (windowIsOpenedAlready) {
        console.warn(`Window of id ${wid} is open already!!`);
        return false;
    }
    windowStack.push({id: wid, info: info ?? {}});
    return true;
}


export function closeWindow(wid: number): boolean {
    /* closes all topmost windows until the window we want is closed */
    let retValue: boolean = false;
    windowStack.update((windowStackBefore) => {
        while (true) {
            if (windowStackBefore.pop().id == wid) {
                retValue = true;
                return windowStackBefore;
            }
        }
        return [];
    });
    return retValue;
}


export function getWindowIsOpen(wid: number): boolean {
    /* gets whether a window with a specific window id is open */
    let retValue = false;
    get(windowStack).forEach(windowObj => {
        if (windowObj.id == wid) {
            return true;
        }
    });
    return retValue;
}


export const windowStack: Writable<Array<WindowType>> = writable([]);
