
export enum TooltipIcon {
    Info = { text: "󰋽", color: "#000000" },
    Warning = { text: "", color: "#fde74c" },
    Error = { text: "", color: "#f4442e" },
    None = { text: "", color: "#000000" }
}

export interface Tooltip {
    text: string,
    icon: TooltipIcon,
    uuid: string
}

export function genTooltip(text, iconName, uuid=undefined): Tooltip {
    return {text, icon: iconName, uuid: uuid ?? crypto.randomUUID()};
}
