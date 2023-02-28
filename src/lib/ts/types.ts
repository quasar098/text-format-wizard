// random string thing
function rst(): string {
    return crypto.randomUUID();
}

export enum ModuleType {
    Append = rst(),
    Replace = rst(),
    Remove = rst(),
}

let moduleMetadata = {
    [ModuleType.Remove]: {
        name: "Regex Remove",
        color: "f9cb40",
        lore: "Remove any matches of regex",
        description: "Find matches of regex and remove them from the text"
    },
    [ModuleType.Replace]: {
        name: "Regex Replace",
        color: "9893da",
        lore: "Replace any matches of regex",
        description: "Find matches of regex and replace those matches with another text"
    },
    [ModuleType.Append]: {
        name: "Append",
        color: "2f52e0",
        lore: "Append to the end of the text",
        description: "Add a specified text to the end of the current text"
    }
};

export { moduleMetadata };
