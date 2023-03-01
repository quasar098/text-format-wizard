// random string thing
function rst(): string {
    return crypto.randomUUID();
}

export enum ModuleType {
    Append = rst(),
    Replace = rst(),
    Remove = rst(),
    Insert = rst()
}

let moduleMetadata = {
    [ModuleType.Remove]: {
        name: "Regex Remove",
        color: "f9cb40",
        lore: "Remove any matches of regex",
        description: "Find matches of regex and remove them from the text",
        processMaker: (args) => {
            let { remove } = args;
            remove = remove ?? "";
            try {
                let regexp = new RegExp(remove, 'g')
                return (text) => { return text.replaceAll(regexp, '') }
            } catch {
                // todo: raise error here
                return (text) => { alert("failure"); return text }
            }
        }
    },
    [ModuleType.Replace]: {
        name: "Regex Replace",
        color: "9893da",
        lore: "Replace any matches of regex",
        description: "Find matches of regex and replace those matches with another text",
        processMaker: (args) => {
            let { remove, insert } = args;
            remove = remove ?? "";
            insert = insert ?? "";
            try {
                let regexp = new RegExp(remove, 'g')
                return (text) => { return text.replaceAll(regexp, insert) }
            } catch {
                // todo: raise error here
                return (text) => { alert("failure"); return text }
            }
        }
    },
    [ModuleType.Append]: {
        name: "Append",
        color: "2f52e0",
        lore: "Append to the end of the text",
        description: "Add a specified text to the end of the current text",
        processMaker: (args) => {
            let { append } = args;
            append = append ?? "";
            return (text) => text + append
        }
    },
    [ModuleType.Insert]: {
        name: "Insert",
        color: "208f40",
        lore: "Insert text at a specific index",
        description: "Insert text at a specific index in the text. Will not replace text.",
        processMaker: (args) => {
            let { insert, index } = args;
            insert = insert ?? "";
            index = index ?? 0;
            if (parseInt(index) == NaN) {
                // todo: raise error here
                return;
            }
            index = parseInt(index);
            return (text) => text.slice(0, index) + insert + text.slice(index)
        }
    }
};

export { moduleMetadata };
