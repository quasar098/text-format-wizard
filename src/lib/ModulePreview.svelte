<script lang="ts">

    import { moduleMetadata, moduleMap, ModuleType } from "./ts/master";
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
        "desc-color": `#${metadata.color}99`
    } : {}

    let titleHasLength;
    if (moduleObject.args.title != undefined) {
        titleHasLength = moduleObject.args.title.length != 0
    }
</script>

<div class="module-preview" use:cssVars={styleVars}>
    {#if closeable}
        <div class="small add-button" on:click={removeMe} on:keydown={removeMe}>
            <p class="ekkxs">
                
            </p>
        </div>
    {/if}
    <div class="big">
        {#if moduleObject.moduleType == ModuleType.Comment}
            {#if titleHasLength}
                <div class="module-title">
                    <h3>{moduleObject.args.title}</h3>
                </div>
            {/if}
            <div class="module-description {closeable ? '' : 'round'}">
                <InputBox bind:value={moduleObject.args.description}/>
            </div>
        {:else}
            <div class="module-title">
                <h3>{(metadata ?? {}).name}</h3>
            </div>
            <div class="module-description {closeable ? '' : 'round'}">
                <svelte:component this={moduleMap[moduleObject.moduleType]}
                    bind:info={moduleObject.args}/>
            </div>
        {/if}
    </div>
</div>

<style>
    h3 {
        font-size: 18px;
    }
    h3, p {
        display: inline;
    }
    p.ekkxs {
        font-size: 18px;
    }
    .module-preview {
        display: flex;
        justify-content: start;
        align-items: stretch;
        margin-bottom: 5px;
        margin-top: 3px;
    }
    .small {
        width: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: white;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        box-shadow: inset 0px 0px 0.4rem rgba(0, 0, 0, 0.2);
        border-right: none;
        cursor: pointer;
        user-select: none;
        transition: 0.2s background-color;
    }
    .small:hover {
        background-color: var(--FOCUSED);
        outline: none;
    }
    .big {
        width: calc(100% - 20px);
        display: inline-block;
    }
    .round {
        border-radius: 4px;
    }
    ::selection {
        color: white;
        background-color: var(--BG-COLOR);
    }
    .module-title {
        border-top-right-radius: 4px;
        padding: 5px;
        background-color: var(--title-color);
    }
    .module-description {
        box-shadow: inset 0px 0px 0.4rem rgba(0, 0, 0, 0.3);
        border-bottom-right-radius: 4px;
        padding: 5px;
        background-color: var(--desc-color);
    }
</style>
