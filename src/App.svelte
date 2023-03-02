<script lang="ts">
    import Frame from "./lib/Frame.svelte";
    import ModuleSelect from "./lib/ModuleSelect.svelte";
    import ModulePreview from "./lib/ModulePreview.svelte";
    import AddModuleModal from "./lib/AddModuleModal.svelte";
    import Toolbar from "./lib/Toolbar.svelte"

    import { recipeModules, outputAsJs } from "./lib/ts/stores";
    import { ModuleType, calculate, moduleMetadata,
        uuidRegex, sortedModuleTypes } from './lib/ts/types';

    let addModalInfo = undefined;

    $: inputText = "";
    $: outputText = calculate(inputText, outputAsJs);

    recipeModules.subscribe(() => {
        outputText = calculate(inputText, outputAsJs);
    });

    function textareaNoTab(e) {
        if (e.keyCode == 9) {
            // todo: put 4 spaces where cursor is
            e.preventDefault(true);
            return false;
        }
    }
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
            {#each sortedModuleTypes() as value, index}
                <ModuleSelect type={value} bind:addModalInfo>
                </ModuleSelect>
            {/each}
        </Frame>
    </div>

    <div class="bottom">
        <Frame title="Input" width=50 overflow="hidden">
            <textarea spellcheck="false" bind:value={inputText} on:keydown={textareaNoTab}/>
        </Frame>
        <Frame title="Output" width=45 overflow="hidden">
            <textarea spellcheck="false" class="out"
                disabled="true" bind:value={outputText}></textarea>
        </Frame>
        <Frame title="󱌣" width=5 alignment="center" overflow="hidden">
            <Toolbar/>
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
        overflow-y: auto;
    }
    textarea {
        -ms-overflow-style: none;  /* Internet Explorer 10+ */
        scrollbar-width: none;  /* Firefox */
    }
    textarea::-webkit-scrollbar {
        display: none;
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
