<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';
    import InputBox from '../InputBox.svelte';

    export let info = { };

    info.format = info.format ?? "%line%: %count%";
</script>

<p>Format of output text:</p> <InputBox bind:value={info.format} defaultValue="%line%: %count%"/>

<style>
    p { display: inline-block; }
</style>
