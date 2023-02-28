<script lang="ts">
    import Frame from "./lib/Frame.svelte";
    import ModuleSelect from "./lib/ModuleSelect.svelte";
    import { ModuleType } from './lib/ts/types.ts';
    let uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/g;
</script>

<main>
    <div class="top">
        <Frame title="Recipe" width=60 placeholder="No modules in this recipe yet">

        </Frame>
        <Frame title="Modules" width=40>
            {#each Object.values(ModuleType) as value, index}
                {#if uuidRegex.test(value)}
                    <ModuleSelect type={value}>
                    </ModuleSelect>
                {/if}
            {/each}
        </Frame>
    </div>
</main>

<style>

</style>
