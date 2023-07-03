import { ModuleType, moduleColor, showWarning } from "./types.ts";


export const moduleMetadata = {
    [ModuleType.RandomLine]: {
        name: "Random Line",
        color: moduleColor.misc,
        lore: "Random line chooser",
        description: "Simple",
        processMaker: (args) => {
            let { method } = args;
            return (text) => {
                let lines = text.split("\n");
                let index = Math.floor(Math.random()*lines.length);
                return lines[index];
            }
        }
    },
    [ModuleType.Append]: {
        name: "Append",
        color: moduleColor.misc,
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
        color: moduleColor.misc,
        lore: "Insert text at a specific index",
        description: "Insert text at a specific index in the text. Will not replace text.",
        processMaker: (args) => {
            let { insert, index } = args;
            insert = insert ?? "";
            index = index ?? 0;
            if (isNaN(parseInt(index))) {
                showWarning(`Invalid index for Insert module`);
                return text => text;
            }
            index = parseInt(index);
            return (text) => text.slice(0, index) + insert + text.slice(index)
        }
    },
    [ModuleType.InsertAfter]: {
        name: "Insert After",
        color: moduleColor.misc,
        lore: "Insert text after some text",
        description: "Insert a string after each regex match",
        processMaker: (args) => {
            let { insert, before } = args;
            insert = insert ?? "";
            before = before ?? "";
            try {
                let beforeRegex = new RegExp(before, 'g')
                return (text) => {
                    let matches = text.matchAll(beforeRegex);
                    let moffs = 0;
                    for (let match of matches) {
                        let index = match.index+match[0].length+moffs;
                        text = text.slice(0, index) + insert + text.slice(index)
                        moffs += insert.length;
                    }
                    return text;
                };
            } catch {
                showWarning(`Invalid Regex at Insert After module`);
                return text => text;
            }
        }
    },
    [ModuleType.InsertBefore]: {
        name: "Insert Before",
        color: moduleColor.misc,
        lore: "Insert text before some text",
        description: "Insert a string before each regex match",
        processMaker: (args) => {
            let { insert, after } = args;
            insert = insert ?? "";
            after = after ?? "";
            try {
                let afterRegex = new RegExp(after, 'g')
                return (text) => {
                    let matches = text.matchAll(afterRegex);
                    let moffs = 0;
                    for (let match of matches) {
                        let index = match.index+moffs;
                        text = text.slice(0, index) + insert + text.slice(index);
                        moffs += insert.length;
                    }
                    return text;
                };
            } catch {
                showWarning(`Invalid Regex at Insert Before module`);
                return text => text;
            }
        }
    },
    [ModuleType.SumDigits]: {
        name: "Sum Digits",
        color: moduleColor.misc,
        lore: "Sum the digits of an number",
        description: "Sum the digits of an number. Does not work on scientific notation. Outputs undefined on error",
        processMaker: (args) => {
            return (text) => {
                try {
                    if (isNaN(text*1)) {
                        showWarning("Error at Sum Digits module");
                        return "undefined";
                    }
                    return text.toString().split("").map(Number).reduce((a, b) => {return a+b}, 0);
                } catch {
                    showWarning("Error at Sum Digits module");
                    return "undefined";
                }
            }
        }
    },
    [ModuleType.ChangeCase]: {
        name: "Change Case",
        color: moduleColor.misc,
        lore: "Change the case of some text",
        description: "Change case of all regex matches to uppercase/lowercase",
        processMaker: (args) => {
            let { regex, newcase } = args;
            regex = regex ?? ".";
            newcase = newcase ?? "keep";
            if (newcase == "keep") {
                return text => text;
            }
            try {
                let regexObj = new RegExp(regex, 'g')
                return (text) => {
                    text = text.replaceAll(regexObj, (a) => {
                        if (newcase == "flip" || newcase == "flipflop") {
                            return a.split('').map((c) => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
                        }
                        if (newcase == "upper") {
                            return a.toUpperCase();
                        }
                        if (newcase == "lower") {
                            return a.toLowerCase();
                        }
                        if (newcase == "random") {
                            let newText = "";
                            for (let letter of a) {
                                newText += Math.random() > 0.5 ? letter.toUpperCase() : letter.toLowerCase();
                            }
                            return newText;
                        }

                        showWarning(`Something went wrong with Change Case module`);
                        return a;
                    });
                    return text;
                };
            } catch (e) {
                showWarning(`Error at Change Case module: ${e}`);
                return text => text;
            }
        }
    },
    [ModuleType.Reverse]: {
        name: "Reverse",
        color: moduleColor.misc,
        lore: "Reverse the text",
        description: "Reverse the text (qwer -> rewq)",
        processMaker: (args) => (text => text.split('').reverse().join(""))
    },
    [ModuleType.Reflect]: {
        name: "Reflect",
        color: moduleColor.misc,
        lore: "Reflect the text",
        description: "Reflect the text (qwer -> qwerrewq)",
        processMaker: (args) => (text => text + text.split('').reverse().join(""))
    },
    [ModuleType.Rotate]: {
        name: "Rotate",
        color: moduleColor.misc,
        lore: "Move characters to the other end",
        description: "Loop the characters and offset them. Ex: Qwerty -> wertyQ",
        processMaker: (args) => {
            let { rotate } = args;
            rotate = rotate ?? 0;
            return (text) => {
                try {
                    rotate = rotate*1;
                    if (isNaN(rotate)) {
                        showWarning(`Rotate Module takes a number`);

                        return text;
                    }
                    let modded = ((rotate % text.length) + text.length) % text.length
                    return text.substring(modded) + text.substring(0, modded);
                } catch (e) {
                    showWarning(`Rotate Module Error: ${e}`)
                    return text;
                }
            }
        }
    },
    [ModuleType.Duplicate]: {
        name: "Duplicate",
        color: moduleColor.misc,
        lore: "Duplicate the text some number of times",
        description: "Duplicate the text a few times",
        processMaker: (args) => {
            let { amount } = args;
            amount = amount ?? 0;
            return (text) => {
                try {
                    if (amount == "") {
                        showWarning("Duplicate Module is missing the argument");
                        return text;
                    }
                    amount = amount*1;
                    if (isNaN(amount)) {
                        showWarning("Duplicate Module takes a number");

                        return text;
                    }
                    return text.repeat(amount);
                } catch (e) {
                    showWarning(`Duplicate Module Error: ${e}`);
                    return text;
                }
            }
        }
    }
}
