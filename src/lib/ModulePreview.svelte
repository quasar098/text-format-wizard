<script lang="ts">

    import { slide } from 'svelte/transition'

    import { moduleMetadata, moduleMap } from "./ts/master.ts";
    import { ModuleType } from "./ts/module.ts";
    import InputBox from "./InputBox.svelte";
    import { recipeModules } from "./ts/stores.ts";
    import cssVars from 'svelte-css-vars';
    import { get } from "svelte/store"

    export let moduleObject;

    export let closeable = true;

    export let removeCallback = () => {};
    export let displaceCallback = () => {};

    export let showUp = true;
    export let showDown = true;

    $: metadata = moduleMetadata[moduleObject.moduleType];

    function removeMe() {
        removeCallback(moduleObject);
    }

    function upMe() {
        displaceCallback(moduleObject, -1);
    }

    function downMe() {
        displaceCallback(moduleObject, 1);
    }

    $: styleVars = metadata != undefined ? {
        "title-color": `#${metadata.color}`,
        "desc-color": `#${metadata.color}ee`,
        "bottom-desc-radius": "4px",
        "toggle-show-bg-color": `#ededed`
    } : {}

    let titleHasLength;
    if (moduleObject.args.title != undefined) {
        titleHasLength = moduleObject.args.title.length != 0
    }
</script>

<div class="module-preview" use:cssVars={styleVars}>
    <div class="big">
        <div class="module-title{closeable ? ' closeable' : ' '}">
            <h3>{(metadata ?? {}).name}</h3>
            {#if closeable}
                <div class="titlebuttons-container">
                    <div class="titlebutton titlebutton-up{!showUp ? ' titlebutton-disabled' : ''}"
                      on:click={upMe} on:keydown={upMe}>
                        <p></p>
                    </div>
                    <div class="titlebutton titlebutton-down{!showDown ? ' titlebutton-disabled' : ''}"
                      on:click={downMe} on:keydown={downMe}>
                        <p></p>
                    </div>
                    <div class="titlebutton titlebutton-close" on:click={removeMe} on:keydown={removeMe}>
                        <p></p>
                    </div>
                </div>
            {/if}
        </div>
        <div class="module-description">
            <svelte:component this={moduleMap[moduleObject.moduleType]} bind:info={moduleObject.args}/>
        </div>
    </div>
</div>

<style>
    h3 {
        font-size: 18px;
        padding: 5px;
    }
    h3 {
        display: inline;
    }
    .module-preview {
        display: flex;
        justify-content: start;
        align-items: stretch;
        margin-bottom: 5px;
        margin-top: 3px;
    }
    .big {
        width: calc(100% - 20px);
        display: inline-block;
    }
    .module-title {
        border-top-left-radius: 4px;
    }
    .titlebuttons-container {
        display: flex;
    }
    .titlebutton {
        user-select: none;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
    }
    .titlebutton-disabled > p {
        opacity: 0;
    }
    .titlebutton-disabled {
        pointer-events: none;
    }
    .titlebutton:not(.titlebutton-disabled):hover {
        background-color: #FFFFFF22;
    }
    .titlebutton-close {
        border-top-right-radius: 4px;
    }
    .titlebutton-close > p {
        transform: translate(-1px, 0px);
    }
    .titlebutton-up > p,.titlebutton-down > p {
        transform: translate(-3px, -2px);
    }
    ::selection {
        color: white;
        background-color: var(--BG-COLOR);
    }
    .module-title {
        border-top-right-radius: 4px;
        background-color: var(--title-color);
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .module-description {
        box-shadow: inset 0px 0px 0.4rem rgba(0, 0, 0, 0.3);
        border-bottom-right-radius: var(--bottom-desc-radius);
        border-bottom-left-radius: var(--bottom-desc-radius);
        padding: 5px;
        background-color: var(--desc-color);
    }
</style>
