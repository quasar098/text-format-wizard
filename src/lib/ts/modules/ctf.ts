import { ModuleType, moduleColor } from "../module.ts";
import { showWarning } from "../tooltip.ts"
import { BigInteger } from 'jsbn';
import { hexy } from 'hexy';


export let moduleMetadata = {
    [ModuleType.HexDump]: {
        name: "Hex Dump",
        color: moduleColor.ctf,
        lore: "Generate a hex dump from the input text",
        description: "Self explanatory",
        processMaker: (args) => {
            return (text) => {
                return hexy(text);
            }
        }
    },
    [ModuleType.Cyclic]: {
        name: "Cyclic",
        color: moduleColor.ctf,
        lore: "Generate a cyclic pattern like pwntools",
        description: "aaaabaaacaaadaaaeaaafaaagaaahaaaiaaajaaakaaalaaamaaa",
        processMaker: (args) => {
            try {
                let { size } = args;
                size = Math.floor(size*0.25);
                if (isNaN(size) | size == 0) {
                    showWarning("Invalid size for cyclic pattern");
                    return (text) => text;
                }
                let total = "";
                let registers = [0, 0, 0, 0];
                for (var i=0; i<size; i++) {
                    for (var i2=0; i2<4; i2++) {
                        total += "abcdefghijklmnopqrstuvwxyz"[registers[i2]];
                    }
                    for (var i2=0; i2<4; i2++) {
                        if (++registers[i2] == 26) {
                            registers[i2] = 0;
                            continue;
                        }
                        break;
                    }
                }
                return (text) => total;
            } catch {
                showWarning("Error while generating a cyclic pattern");
                return (text) => "";
            }
        }
    },
    [ModuleType.WordlistMask]: {
        name: "Wordlist Mask",
        color: moduleColor.ctf,
        lore: "Emulate John the Ripper masks but slightly different",
        description: "Expand different possibilities for password cracking wordlists and other utilities",
        processMaker: (args) => {
            let { mask } = args;
            mask = mask ?? "?w";
            return (text) => {
                try {
                    let splitted = [];
                    mask.replaceAll(/([^?]+|\?.)/g, (m) => {
                        splitted.push(m);
                    });
                    let intermediates = [];
                    for (let newton of splitted) {
                        if (!newton.length) {
                            continue;
                        }
                        if (newton[0] == "?") {
                            let loose = newton[1].toLowerCase() == newton[1];
                            newton = newton[0] + newton[1].toLowerCase();
                            // todo: switch-case instead
                            if (newton[1] == "?") {
                                intermediates.push({type: "questionmark", options: ["?"], count: 0});
                            } else if (newton[1] == "w") {
                                intermediates.push({type: "originalword", options: text.split("\n"), count: 0});
                            } else if (newton[1] == "d") {
                                intermediates.push({type: "digit", options: "0123456789".split(""), count: 0});
                            } else if (newton[1] == "l") {
                                intermediates.push({type: "lowerletter", options: "abcdefghijklmnopqrstuvwxyz".split(""), count: 0});
                            } else if (newton[1] == "s") {
                                intermediates.push({type: "special", options: "!@#$%^&*()[]{}<>,.?/\\|+_=-~`\"';:".split(""), count: 0});
                            } else if (newton[1] == "u") {
                                intermediates.push({type: "upperletter", options: "abcdefghijklmnopqrstuvwxyz".toUpperCase().split(""), count: 0});
                            } else if (newton[1] == "a") {
                                intermediates.push({type: "alphanum", options: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split(""), count: 0});
                            } else {
                                continue;
                            }
                            if (loose) {
                                if (newton[1].toUpperCase() != newton[1].toLowerCase()) {
                                    intermediates[intermediates.length-1].options.push("");
                                }
                            }
                        } else {
                            intermediates.push({type: "newton", options: [newton], count: 0});
                        }
                    }
                    let possible = [];
                    let times = 0;
                    while (true) {
                        let newPossible = "";
                        for (let intermediate of intermediates) {
                            // this should prevent numbers from showing up
                            newPossible += (intermediate.options[intermediate.count]).toString(10);
                        }
                        possible.push(newPossible);
                        for (let intermediate of intermediates) {
                            let intermax = intermediate.options.length;
                            if (intermediate.count++ >= intermax-1) {
                                intermediate.count = 0;
                                continue;
                            }
                            break;
                        }
                        winner: {
                            for (let intermediate of intermediates) {
                                if (intermediate.count != 0) {
                                    break winner;
                                }
                            }
                            return possible.join("\n");
                        }
                        // this is necessary (the number, not the restriction), trust me
                        if (times++ > 6942069) {
                            showWarning("Looping too long at JTR Mask Module")
                            return text;
                        }
                    }
                    showWarning("Cannot escape while loop at JTR Mask Module");
                    return text;
                } catch (e) {
                    showWarning(`Evaluation error at JTR Mask Module`);
                    return text;
                }
            };
        }
    },
    [ModuleType.RSAEncryption]: {
        name: "RSA",
        color: moduleColor.ctf,
        lore: "Decrypt RSA given p, q, e, ct, where ct is passed in as input text.",
        description: "Decrypt RSA given p, q, e. Decrypts the input text number",
        processMaker: (args) => {
            let { p, q, e } = args;
            if (p.length == 0 || q.length == 0 || e.length == 0) {
                return (text) => text;
            }
            try {
                p = new BigInteger(p);
                q = new BigInteger(q);
                e = new BigInteger(e);
                let n = p.multiply(q);
                let phi = p.subtract(new BigInteger('1')).multiply(q.subtract(new BigInteger('1')));
                let d = e.modInverse(phi);
                return (text) => {
                    try {
                        return new BigInteger(text).modPow(d, n).toString();
                    } catch {
                        showWarning('RSA unable to decrypt given ciphertext');
                        return text;
                    }
                }
            } catch (e) {
                console.log(e);
                showWarning("RSA module parameters faulty (check p, q, e)");
                return (text) => text;
            }
        }
    }
};
