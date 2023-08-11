import { writable, get } from 'svelte/store';
import type { Writable } from "svelte/store";

export enum TooltipIcon {
    Info = { text: "󰋽", color: "#000000" },
    Warning = { text: "", color: "#fde74c" },
    Error = { text: "", color: "#f4442e" },
    None = { text: "", color: "#000000" }
}

// todo: rename to TooltipType
export interface Tooltip {
    text: string,
    icon: TooltipIcon,
    uuid: string
}

export function genTooltip(text, iconName, uuid=undefined): Tooltip {
    return { text, icon: iconName, uuid: uuid ?? crypto.randomUUID() };
}


const tooltipStack: Writable<Array<TooltipType>> = writable([]);
export const tooltipStackInstanceId: Writable<number> = writable(0);


export const WARNING_UUID = "01234567-0123-0123-1337-694204206969";


export function showWarning(message): void {
    tooltipStackInstanceId.update(_ => _+1);
    tooltipStack.update((stack) => {
        stack.splice(0, 0, genTooltip(message, "Warning", WARNING_UUID));
        return stack;
    })
}


export function showError(message): void {
    tooltipStackInstanceId.update(_ => _+1);
    tooltipStack.update((stack) => {
        stack.splice(0, 0, genTooltip(message, "Error", WARNING_UUID));
        return stack;
    })
}


export function filterTooltipStack(filterFn: (input: Tooltip) => Tooltip): void {
    tooltipStackInstanceId.update(_ => _+1);
    tooltipStack.update((stack) => {
        return stack.filter(filterFn);
    })
}


export function pushTooltip(tooltipToPush: Tooltip): void {
    tooltipStackInstanceId.update(_ => _+1);
    tooltipStack.update((stack) => {
        stack.push(tooltipToPush);
        return stack;
    })
}


export function getTopmostTooltip(): Tooltip {
    let gottenStack = get(tooltipStack);
    return gottenStack[gottenStack.length-1] ?? { text: "", icon: TooltipIcon[TooltipIcon.None], uuid: "" };
}
