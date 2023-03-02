<script lang="ts">
    import { ModuleType, moduleMap, uuidRegex, sortedModuleTypes } from "./ts/types";
    import ModulePickerOption from "./ModulePickerOption.svelte";

    export let picked;

</script>

<div class="picker">
    {#each sortedModuleTypes() as mId, index}
        <ModulePickerOption id={mId} bind:picked={picked}/>
    {/each}
</div>

<style>
    .picker {
        border-radius: 4px;
        background-color: white;
        margin: 10px 0px 10px 0px;
        height: 50%;
        width: 100%;
        overflow-y: auto;
        box-shadow: inset 0 0 0.4rem rgba(0, 0, 0, 0.2);
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
    }
    .picker::-webkit-scrollbar {
        display: none;
    }
</style>
