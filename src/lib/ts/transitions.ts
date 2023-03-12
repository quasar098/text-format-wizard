import { quadInOut } from 'svelte/easing';

function backOut(t) {
    const s = 0.7;
    return --t * t * ((s + 1) * t + s) + 1;
}

// meant to replicate discord frame transitions

export function discordIn(node, { duration }) {
    return {
        duration: 330,
        css: t => {
            const eased = backOut(t);

            return `
                transform: scale(${eased});
                opacity: ${eased};
            `
        }
    }
}

export function discordOut(node, { duration }) {
    return {
        duration: 270,
        css: t => {
            const eased = backOut(t);

            return `
                transform: scale(${eased});
                opacity: ${eased*1.5-0.5};
                pointer-events: none;
            `
        }
    }
}

export function fadeBgOut(node, { duration }) {
    return {
        duration: 240,
        css: t => {
            const eased = quadInOut(t)

            return `
                background-color: rgba(0, 0, 0, ${eased/4});
                pointer-events: none;
            `
        }
    }
}

export function fadeBgIn(node, { duration }) {
    return {
        duration: 240,
        css: t => {
            const eased = quadInOut(t)

            return `
                background-color: rgba(0, 0, 0, ${eased/4});
            `
        }
    }
}
