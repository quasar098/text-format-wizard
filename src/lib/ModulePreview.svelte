<script lang="ts">

    import { slide } from 'svelte/transition'

    import { moduleMetadata, moduleMap } from "./ts/master";
    import { ModuleType } from "./ts/modules/types";
    import InputBox from "./InputBox.svelte";
    import { recipeModules } from "./ts/stores";
    import cssVars from 'svelte-css-vars';
    import { get } from "svelte/store"

    export let moduleObject;

    export let closeable = true;

    export let removeCallback = () => {};

    $: metadata = moduleMetadata[moduleObject.moduleType];

    function removeMe() {
        removeCallback(moduleObject);
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
                <div class="close" on:click={removeMe} on:keydown={removeMe}>
                    <p></p>
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
    .close {
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
    }
    .close:hover {
        background-color: #FFFFFF22;
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
    .close {
        user-select: none;
    }
</style>
