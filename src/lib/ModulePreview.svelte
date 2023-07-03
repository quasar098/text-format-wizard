<script lang="ts">

    import { slide } from 'svelte/transition'

    import { moduleMetadata, moduleMap } from "./ts/master";
    import { ModuleType } from "./ts/modules/types";
    import InputBox from "./InputBox.svelte";
    import { recipeModules } from "./ts/stores";
    import cssVars from 'svelte-css-vars';

    export let moduleObject;

    export let closeable = true;

    $: metadata = moduleMetadata[moduleObject.moduleType];

    function removeMe() {
        recipeModules.update((old) => {
            return old.filter(_ => _ != moduleObject);
        });
    }

    $: styleVars = metadata != undefined ? {
        "title-color": `#${metadata.color}`,
        "desc-color": `#${metadata.color}99`,
        "bottom-desc-radius": closeable ? "0px" : "4px",
        "toggle-show-bg-color": `#ededed`
    } : {}

    let collapsed = false;

    let titleHasLength;
    if (moduleObject.args.title != undefined) {
        titleHasLength = moduleObject.args.title.length != 0
    }

    function toggleCollapsed() {
        collapsed = !collapsed;
    }
</script>

<div class="module-preview" use:cssVars={styleVars}>
    <div class="big">
        <div class="module-title{closeable ? ' ' : ' closeable'}">
            <h3>{(metadata ?? {}).name}</h3>
            {#if closeable}
                <div class="close" on:click={removeMe} on:keydown={removeMe}>
                    <p></p>
                </div>
            {/if}
        </div>
        {#if !collapsed}
            <div class="module-description{closeable ? ' ' : ' closeable'}" transition:slide|local>
                <svelte:component this={moduleMap[moduleObject.moduleType]} bind:info={moduleObject.args}/>
            </div>
        {/if}
        {#if closeable}
            {#if collapsed}
                <div class='expand' on:click={toggleCollapsed}>
                    
                </div>
            {:else}
                <div class='collapse' on:click={toggleCollapsed}>
                    
                </div>
            {/if}
        {/if}
    </div>
</div>

<style>
    .expand,.collapse {
        width: 100%;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: white;
        cursor: pointer;
        border-bottom-right-radius: 4px;
        border-bottom-left-radius: 4px;
        box-shadow: inset 0 0 0.2rem rgba(0, 0, 0, 0.2);
        background-color: #F7F7F7;
        transition-duration: 0.2s;
    }
    .expand:hover,.collapse:hover {
        background-color: var(--FOCUSED);
    }
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
    .module-title.closeable {
        border-top-left-radius: 4px;
    }
    .module-description.closeable {
        border-bottom-left-radius: 4px;
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
    .collapse,.expand,.close {
        user-select: none;
    }
</style>
