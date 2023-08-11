<script lang="ts">
    import Frame from "./lib/Frame.svelte";
    import ModuleSelect from "./lib/ModuleSelect.svelte";
    import ModuleFilter from "./lib/ModuleFilter.svelte";
    import ModulePreview from "./lib/ModulePreview.svelte";
    import AddModuleModal from "./lib/AddModuleModal.svelte";
    import FindModuleModal from "./lib/FindModuleModal.svelte";
    import SettingsModal from "./lib/SettingsModal.svelte";
    import Toolbar from "./lib/Toolbar.svelte";
    import cssVars from 'svelte-css-vars';

    import { Svroller } from "svrollbar";
    import TooltipBox from "./lib/TooltipBox.svelte";

    import InputOutputTextareas from "./lib/InputOutputTextareas.svelte";

    import { recipeModules, hasLoadedAllModules, moduleFrameFilter } from "./lib/ts/stores.ts";
    import { calculate, moduleMetadata, uuidRegex, sortedModuleTypes } from './lib/ts/master.ts';
    import { ModuleType } from "./lib/ts/module.ts";

    function removeModuleCallback(moduleObject) {
        recipeModules.update((old) => {
            return old.filter(_ => _ != moduleObject);
        });
    }

    function filterModuleTypes(inputModuleTypes) {
        if ($moduleFrameFilter.length == 0) {
            return inputModuleTypes;
        }
        return inputModuleTypes.filter(mType => $moduleFrameFilter == moduleMetadata[mType].color);
    }

    $: filteredAndSortedModuleTypes = ($moduleFrameFilter || true) && filterModuleTypes(sortedModuleTypes());

</script>

<main>
    <AddModuleModal/>
    <FindModuleModal/>
    <SettingsModal/>

    <div class="top">
        <Frame title="> Recipe" width=60 height="100% + 10px">
            {#if Object.keys($recipeModules).length === 0}
                <div class='no-modules'>
                    <p class="text text-glow">No modules are in this recipe</p>
                    <br><br>
                </div>
            {:else}
                <Svroller width="100%" height="100%" alwaysVisible="true">
                    {#key $hasLoadedAllModules}
                        {#each $recipeModules as item, index}
                            {#if $recipeModules.includes(item)}
                                <ModulePreview bind:moduleObject={item} removeCallback={removeModuleCallback}/>
                            {/if}
                        {/each}
                    {/key}
                </Svroller>
            {/if}
        </Frame>
        <Frame title="> Modules" width=40 height="100% + 10px">
            <ModuleFilter/>
            <div class="modules-frame-modules">
                <Svroller width="100%" height="100%" alwaysVisible="true">
                    {#key $moduleFrameFilter}
                        {#each filteredAndSortedModuleTypes as value, index}
                            <ModuleSelect type={value}>
                            </ModuleSelect>
                        {/each}
                    {/key}
                </Svroller>
            </div>
        </Frame>
    </div>

    <div class="bottom">
        <InputOutputTextareas/>
        <Frame title="󱌣" width=5 alignment="center" overflow="auto">
            <Svroller width="100%" height="100%" alwaysVisible="true">
                <Toolbar/>
            </Svroller>
        </Frame>
    </div>

    <TooltipBox/>

</main>

<style>
    .no-modules {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .modules-frame-modules {
        height: 100%;
        width: calc(100% - 65px);
        padding-left: 65px;
    }
    .top {
        height: calc(50% - 20px);
    }
    .bottom {
        height: calc(50% - 20px);
    }
    main {
        height: 100%;
    }
</style>
