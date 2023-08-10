import { ModuleType, moduleColor, showWarning, replaceTag } from "./types.ts";


export const moduleMetadata = {
    [ModuleType.PrependLineNumber]: {
        name: "Prepend Line Number",
        color: moduleColor.misc,
        lore: "Prepend the number of the line",
        description: "Prepend the number of the line in a specific format",
        processMaker: (args) => {
            let { format } = args;
            format = format ?? "%number%.\t%line%";
            return (text) => {
                try {
                    let lines = text.split("\n");
                    let newLines = [];
                    for (let lineIndex in lines) {
                        let line = lines[lineIndex];
                        newLines.push(replaceTag("line", line)(replaceTag("number", `${(lineIndex*1)+1}`)(format)));
                    }
                    return newLines.join("\n");
                } catch (e) {
                    showWarning("Prepend Line Number Module Error");
                    return text;
                }
            }
        }
    },
    [ModuleType.FibonacciSequence]: {
        name: "Fibonacci Sequence",
        color: moduleColor.misc,
        lore: "Generate numbers in the fibonacci sequence",
        description: "First two integers are 1, by the way",
        processMaker: (args) => {
            let { amount } = args;
            amount = amount ?? 0;
            return (text) => {
                if (amount == 0) {
                    return text;
                }
                let integers = [];
                for (let i=0; i<amount; i++) {
                    if (i < 2) {
                        integers.push(1n);
                        continue;
                    }
                    integers.push(integers[integers.length-2]+integers[integers.length-1]);
                }
                return integers.join(", ")
            }
        }
    },
    [ModuleType.RandomLine]: {
        name: "Random Line",
        color: moduleColor.misc,
        lore: "Random line chooser",
        description: "Simple random line chooser",
        processMaker: (args) => {
            let { method } = args;
            return (text) => {
                let lines = text.split("\n");
                if (lines.length == 1) {
                    return lines[0];
                }
                let index = Math.floor(Math.random()*lines.length);
                return lines[index];
            }
        }
    },
    [ModuleType.SortLines]: {
        name: "Sort Lines",
        color: moduleColor.misc,
        lore: "Sort lines alphabetically",
        description: "Self explanatory",
        processMaker: (args) => {
            return (text) => {
                try {
                    return text.split("\n").sort().join("\n");
                } catch {
                    showWarning("Sort Lines Module failed");
                    return text;
                }
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
    [ModuleType.RGBToHex]: {
        name: "RGB To Hex",
        color: moduleColor.misc,
        lore: "RGB color code to hex",
        description: "Change an rgb color code to hex. Pass it in as text",
        processMaker: (args) => {
            function componentToHex(c) {
                var hex = (c*1).toString(16);
                return hex.length == 1 ? "0" + hex : hex;
            }
            return (text) => {
                try {
                    text = text.replaceAll(/[^0123456789abcdef]+/g, ",").replaceAll(/(^,|,$)/g, "");
                    let cols = text.split(",");
                    return "#" + cols.map(componentToHex).join("").toUpperCase();
                } catch {
                    showWarning("Runtime error at RGB To Hex module");
                    return text;
                }
            }
        }
    },
    [ModuleType.HexToRGB]: {
        name: "Hex to RGB",
        color: moduleColor.misc,
        lore: "Hex color code to RGB",
        description: "Change a hex color code to rgb. Pass it in as text",
        processMaker: (args) => {
            let hexToRGB = (hex) => {
                let r = 0;
                let g = 0;
                let b = 0;
                let a = 0;
                hex = hex.toLowerCase();
                let nmap = "0123456789abcdef";
                r += nmap.indexOf(hex[0])*16;
                r += nmap.indexOf(hex[1]);
                g += nmap.indexOf(hex[2])*16;
                g += nmap.indexOf(hex[3]);
                b += nmap.indexOf(hex[4])*16;
                b += nmap.indexOf(hex[5]);
                if (hex.length == 8) {
                    a += nmap.indexOf(hex[6])*16;
                    a += nmap.indexOf(hex[7]);
                }
                return hex.length == 8 ? [r, g, b, a] : [r, g, b];
            }
            return (text) => {
                try {
                    text = text.replaceAll(/[^abcdef0123456789]/gi, "");
                    if ([6, 8].includes(text.length)) {
                        return hexToRGB(text);
                    }
                    showWarning(`"${text}" is not a valid hex code!`)
                    return text;
                } catch (e) {
                    showWarning("Runtime error at Hex to RGB module");
                    return text;
                }
            }
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
