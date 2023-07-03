<script lang="ts">
    import Frame from "./lib/Frame.svelte";
    import ModuleSelect from "./lib/ModuleSelect.svelte";
    import ModulePreview from "./lib/ModulePreview.svelte";
    import AddModuleModal from "./lib/AddModuleModal.svelte";
    import FindModuleModal from "./lib/FindModuleModal.svelte";
    import Toolbar from "./lib/Toolbar.svelte";
    import cssVars from 'svelte-css-vars';

    import { Svroller } from "svrollbar";
    import TooltipBox from "./lib/TooltipBox.svelte";

    import InputOutputTextareas from "./lib/InputOutputTextareas.svelte";

    import { recipeModules, addModuleModalInfo } from "./lib/ts/stores";
    import { calculate, moduleMetadata,
        uuidRegex, sortedModuleTypes } from './lib/ts/master';
    import { ModuleType } from "./lib/ts/modules/types.ts";

</script>

<main>
    <AddModuleModal/>
    <FindModuleModal/>

    <div class="top">
        <Frame title="Recipe" width=60 height="100% + 10px">
            {#each $recipeModules as item, index}
                <ModulePreview bind:moduleObject={item}/>
            {:else}
                <p>No modules are in this recipe</p>
            {/each}
        </Frame>
        <Frame title="Modules" width=40 height="100% + 10px">
            <Svroller width="100%" height="100%" alwaysVisible="true">
                {#each sortedModuleTypes() as value, index}
                    <ModuleSelect type={value}>
                    </ModuleSelect>
                {/each}
            </Svroller>
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
