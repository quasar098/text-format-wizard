import { ModuleType, moduleColor, replaceTag } from "../module.ts";
import { showWarning } from "../tooltip.ts"


export let moduleMetadata = {
    [ModuleType.CountLineOccurences]: {
        name: "Count Line Occurences",
        color: moduleColor.generic,
        lore: "Count the number of occurences of each line",
        description:
            "Count the number of occurences of each line and output it in a specific format",
        processMaker: (args) => {
            let { format } = args;
            format = format ?? "%line%: %count%";
            return (text) => {
                let counted = new Map();
                for (let line of text.split("\n")) {
                    counted.set(line, (counted.get(line) ?? 0) + 1)
                }
                counted = new Map([...counted.entries()].sort((a,b) => "" + (1*b[1]-1*a[1])));
                let texts = [];
                for (let pair of counted) {
                    texts.push(replaceTag("count", pair[1])(replaceTag("line", pair[0])(format)));
                }
                text = texts.join("\n")
                return text;
            }
        }
    },
    [ModuleType.CountMatches]: {
        name: "Count Matches",
        color: moduleColor.generic,
        lore: "Count number of regex matches",
        description: "Count the number of regex matches and set the text to that number",
        processMaker: (args) => {
            let { regex } = args;
            regex = regex ?? "\n";
            try {
                let regexObj = new RegExp(regex, 'g');
                return (text) => {
                    return "" + (text.match(regexObj) ?? []).length;
                };
            } catch {
                showWarning(`Invalid Regex at Count Matches Module`);
                return (text) => text;
            }
        }
    },
    [ModuleType.CountChars]: {
        name: "Count Chars",
        color: moduleColor.generic,
        lore: "Count number of chars",
        description: "Counts newlines too!",
        processMaker: (args) => {
            return (text) => {
                return text.length + "";
            };
        }
    },
    [ModuleType.KeepRegex]: {
        name: "Keep Regex",
        color: moduleColor.generic,
        lore: "Keep Regex matches and format them too",
        description: "Only keep matches of regex and list them out",
        keywords: "Capture Group",
        processMaker: (args) => {
            let { regex, format } = args;
            regex = regex ?? "\n";
            format = format ?? "";
            try {
                let regexObj = new RegExp(regex, 'g');
                return (text) => {
                    try {
                        let texts = [];
                        for (let match of text.matchAll(regexObj)) {
                            let formatcopy = format;
                            for (var index = 0; index < match.length; index++) {
                                let group = match[index];
                                if (index == 0) {
                                    formatcopy = replaceTag("original", group)(formatcopy);
                                    continue;
                                }
                                formatcopy = replaceTag((index-1) + "", group)(formatcopy);
                            }
                            texts.push(formatcopy);
                        }
                        return texts.join("\n");
                    } catch (e) {
                        showWarning(`Error with Keep Regex Module: ${e}`);
                        return text;
                    }
                }
            } catch (e) {
                showWarning(`Error with Keep Regex Module: ${e}`);
                return (text) => text;
            }
        }
    },
    [ModuleType.CountLines]: {
        name: "Count Lines",
        color: moduleColor.generic,
        lore: "Count number of lines",
        description: "Count the number of lines (empty string is 1 line)",
        processMaker: (args) => {
            return text => ((text ?? "").split("\n") ?? "").length;
        }
    },
    [ModuleType.CountVowels]: {
        name: "Count Vowels",
        color: moduleColor.generic,
        lore: "Count number of vowels",
        description: "Count the number of vowels (a,e,i,o,u)",
        processMaker: (args) => {
            return text => ((text ?? "").match(/[aeiou]/gi) ?? "").length;
        }
    },
    [ModuleType.CountConsonants]: {
        name: "Count Consonants",
        color: moduleColor.generic,
        lore: "Count number of consonants",
        description: "Count the number of vowels (any that aren't a,e,i,o,u)",
        processMaker: (args) => {
            return text => ((text ?? "").match(/[bcdfghjklmnpqrstvwxyz]/gi) ?? "").length;
        }
    },
    [ModuleType.CountWords]: {
        name: "Count Words",
        color: moduleColor.generic,
        lore: "Count number of words",
        description: "Count the number of words in the text",
        processMaker: (args) => {
            return text => ((text ?? "").match(/\w+(?:'\w+)?/g) ?? "").length;
        }
    },
    [ModuleType.Remove]: {
        name: "Regex Remove",
        color: moduleColor.generic,
        lore: "Remove any matches of regex",
        description: "Find matches of regex and remove them from the text",
        processMaker: (args) => {
            let { remove } = args;
            remove = remove ?? "";
            try {
                let regexp = new RegExp(remove, 'g')
                return (text) => { return text.replaceAll(regexp, '') }
            } catch {
                showWarning(`Invalid regex at Remove module`);
                return text => text;
            }
        }
    },
    [ModuleType.RemoveBlankLines]: {
        name: "Remove Blank Lines",
        color: moduleColor.generic,
        lore: "Self explanatory",
        description: "Self explanatory",
        processMaker: (args) => {
            return text => text.split("\n").filter(_ => _ != '').join("\n");
        }
    },
    [ModuleType.Replace]: {
        name: "Regex Replace",
        color: moduleColor.generic,
        lore: "Replace any matches of regex",
        description: "Find matches of regex and replace each of those matches with another format",
        processMaker: (args) => {
            let { remove, format } = args;
            remove = remove ?? "";
            format = format ?? "";
            try {
                let regexp = new RegExp(remove, 'g')
                return (text) => {
                    return text.replaceAll(regexp, (...match) => {
                        let formatcopy = format;
                        match = match.slice(0, -2);
                        for (var index = 0; index < match.length; index++) {
                            let group = match[index];
                            if (index == 0) {
                                formatcopy = replaceTag("original", group)(formatcopy);
                                continue;
                            }
                            formatcopy = replaceTag((index-1) + "", group)(formatcopy);
                        }
                        return formatcopy;
                    })
                }
            } catch (e) {
                showWarning(`Error with Regex Replace module: ${e}`);
                return text => text;
            }
        }
    }
}
