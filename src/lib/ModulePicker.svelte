<script lang="ts">
    import { fade } from 'svelte/transition'
    import { ModuleType, moduleMap,
        uuidRegex, sortedModuleTypes, moduleMetadata } from "./ts/master";
    import ModulePickerOption from "./ModulePickerOption.svelte";

    import { Svroller } from "svrollbar";
    export let picked;

    let moduleTypes = sortedModuleTypes().filter((item) => {
        return moduleMetadata[item].name != "Comment";
    });

    let noTransition = node => fade(node, { duration: 0 });
</script>

<div class="picker">
    <Svroller width="100%" height="100%" alwaysVisible="true" vTrackOut={noTransition} vTrackIn={noTransition}
        vThumbIn={noTransition} vThumbOut={noTransition} hideAfter=0>
        {#each moduleTypes as mId, index}
            <ModulePickerOption id={mId} bind:picked={picked}/>
        {/each}
    </Svroller>
</div>

<style>
    .picker {
        border-radius: 4px;
        background-color: white;
        margin: 10px 0px 10px 0px;
        padding-top: 10px;
        padding-bottom: 10px;
        padding-right: 3px;
        height: 200px;
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
