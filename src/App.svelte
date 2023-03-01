<script lang="ts">
    import Frame from "./lib/Frame.svelte";
    import ModuleSelect from "./lib/ModuleSelect.svelte";
    import ModulePreview from "./lib/ModulePreview.svelte";
    import AddModuleModal from "./lib/AddModuleModal.svelte";

    import { recipeModules, calculate } from "./lib/ts/stores";
    import { ModuleType, moduleMetadata } from './lib/ts/types';
    let uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/g;

    let addModalInfo = undefined;

    $: inputText = "";
    $: outputText = calculate(inputText);

    recipeModules.subscribe(() => {
        outputText = calculate(inputText);
    });
</script>

<main>
    <AddModuleModal bind:addModalInfo/>

    <div class="top">
        <Frame title="Recipe" width=60 height="100% + 10px">
            {#each $recipeModules as item, index}
                <ModulePreview moduleObject={item}/>
            {:else}
                <p>No modules are in this recipe</p>
            {/each}
        </Frame>
        <Frame title="Modules" width=40 height="100% + 10px">
            {#each Object.values(ModuleType) as value, index}
                {#if uuidRegex.test(value)}
                    <ModuleSelect type={value} bind:addModalInfo>
                    </ModuleSelect>
                {/if}
            {/each}
        </Frame>
    </div>

    <div class="bottom">
        <Frame title="Input" width=50>
            <textarea spellcheck="false" bind:value={inputText}/>
        </Frame>
        <Frame title="Output" width=50>
            <textarea spellcheck="false" class="out"
                disabled="true" bind:value={outputText}></textarea>
        </Frame>
    </div>

</main>

<style>
    textarea {
        resize: none;
        width: calc(100% - 22.5px);
        height: calc(100% - 22.5px);
        border: 1px solid black;
        border-radius: 4px;
        padding: 10px;
        outline: none;
        transition: 0.2s;
        font-variant-ligatures: none;
        background-color: white;
        color: black;
    }
    textarea.out {
        cursor: text;
    }
    textarea:focus {
        border: 1px solid var(--FOCUSED);
    }
    .top {
        height: 55%;
    }
    .bottom {
        height: 45%;
    }
    main {
        height: 100%;
    }
</style>
