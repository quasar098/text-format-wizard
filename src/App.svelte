<script lang="ts">
    import Frame from "./lib/Frame.svelte";
    import ModuleSelect from "./lib/ModuleSelect.svelte";
    import AddModuleModal from "./lib/AddModuleModal.svelte";
    import { recipeModules } from "./lib/ts/stores";
    import { ModuleType, moduleMetadata } from './lib/ts/types';
    let uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/g;

    let addModalInfo = undefined;
</script>

<main>
    <AddModuleModal bind:addModalInfo/>

    <div class="top">
        <Frame title="Recipe" width=60>
            {#each $recipeModules as item, index}
                {item}
            {:else}
                <p>No modules are in this recipe</p>
            {/each}
        </Frame>
        <Frame title="Modules" width=40>
            {#each Object.values(ModuleType) as value, index}
                {#if uuidRegex.test(value)}
                    <ModuleSelect type={value} bind:addModalInfo>
                    </ModuleSelect>
                {/if}
            {/each}
        </Frame>
    </div>
</main>

<style>

</style>
