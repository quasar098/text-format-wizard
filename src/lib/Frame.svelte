<script lang="ts">
    export let title: string = undefined;
    export let color: string = undefined;
    export let width: number = 100;
    export let height: string = "100%";
    export let alignment: string = "none";
    export let onclose = undefined;
    export let overflow = "auto";
    export let enterTransition = () => {};
    export let exitTransition = () => {};

    import Tooltipable from "./Tooltipable.svelte";

    let displayType: string = "block";
    if (width != 100) {
        displayType = "inline-block";
    }
    if (color == undefined) {
        color = 'var(--ACCENT)';
    }
    import cssVars from "svelte-css-vars";

    $: styleVars = {
        // outer frame stuff
        outerFrameWidth: `calc(${width}% - 10px - ${width/10}px)`,
        outerFrameDisplay: displayType,
        outerFrameHeight: `calc(${height} - 15px)`,

        // title stuff
        titleSectBg: color,
        titleTransform: alignment == "center" ? 'translateX(-3px)' : 'none',  // translate to left b/c only centered titles are icons
        titleAlignment: alignment,

        // (inner) frame stuff
        frameOverflowY: overflow,
        frameHeight: `calc(${height} - 63px)`
    };
</script>

<div class="outer-frame" use:cssVars={styleVars} in:enterTransition out:exitTransition>
    {#if title != undefined}
        <div class="title-sect">
            <h2 class="title text text-glow">{title}</h2>
            {#if onclose != undefined}
                <Tooltipable text="Close Modal (esc)" icon="Info">
                    <div on:click={onclose} on:keydown={ () => {} } class='close-outer'>
                        <p class="close text"></p>
                    </div>
                </Tooltipable>
            {/if}
        </div>
    {/if}
    <div class='frame'>
        <slot></slot>
    </div>
</div>

{#if title == undefined}
    <style>
        .frame {
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
        }
    </style>
{/if}

<style>
    p, h2 { margin: 0 }
    .title-sect {
        border-radius: 4px;
        border-bottom-left-radius: 0px;
        border-bottom-right-radius: 0px;
        padding: 5px;
        padding-top: 13px;
        width: calc(100% - 10px);
        padding-bottom: 6px;
        user-select: none;
        display: inline-block;
        position: relative;
        background-color: var(--titleSectBg);
    }
    h2 {
        font-size: 24px;
    }
    .outer-frame {
        float: left;
        margin: 10px;
        margin-right: 0px;
        margin-bottom: 0px;
        position: relative;
        width: var(--outerFrameWidth);
        height: var(--outerFrameHeight);
        display: var(--outerFrameDisplay);
    }
    ::selection {
        color: white;
        background-color: var(--BG-COLOR);
    }
    .title {
        transform: var(--titleTransform);
        text-align: var(--titleAlignment);
    }
    .frame {
        background-color: var(--FRAME-COLOR);
        box-shadow: inset 0 0 0.6em rgba(0, 0, 0, 0.23);
        border-bottom-right-radius: 4px;
        border-bottom-left-radius: 4px;
        padding: 5px;
        top: 0;
        left: 0;
        width: calc(100% - 10px);
        overflow-y: var(--frameOverflowY);
        display: inline-block;
        height: var(--frameHeight);
    }
    .frame::-webkit-scrollbar {
        display: none;
    }
    .frame::-moz-scrollbar {
        display: none;
    }
    .close-outer {
        position: absolute;
        float: right;
        height: 43px;
        width: 43px;
        right: 0px;
        top: 0px;
        justify-content: center;
        align-items: center;
        display: flex;
        border-top-right-radius: 4px;
        cursor: pointer;
    }
    .close {
        font-size: 24px;
    }
    .close-outer:hover {
        background-color: #FFFFFF11;
    }
    .close-outer:focus-visible {
        outline: none;
        background-color: #ffffff11;
    }
</style>
