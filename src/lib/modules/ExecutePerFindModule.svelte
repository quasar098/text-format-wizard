<script lang="ts">
    import { get } from 'svelte/store'
    import { ModuleType } from "../ts/module.ts";
    import { recipeModules } from '../ts/stores.ts';
    import InputBox from '../InputBox.svelte';

    import ModulePreview from '../ModulePreview.svelte';
    import ModulePicker from '../ModulePicker.svelte';

    export let info = { moduleType: undefined, args: {} };
</script>

<p>Regex to search for</p>
<InputBox bind:value={info.regex}/>
<spacer/>
<p>Pick module</p>
<ModulePicker bind:picked={info}></ModulePicker>
<spacer/>
<p>Edit module</p>
{#if info.moduleType != undefined}
    <ModulePreview bind:moduleObject={info} closeable={false}></ModulePreview>
{:else}
    <p class="shrug">No module selected</p>
{/if}

<style>
    .shrug {
        font-style: italic;
    }
</style>
