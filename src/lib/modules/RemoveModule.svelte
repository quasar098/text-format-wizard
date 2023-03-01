<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';

    export let info = {};
    export let redo = () => {};
</script>

<p>Regex search to remove</p>
<input type="text" bind:value={info.remove} spellcheck="false" autofocus="true" on:keydown={redo}/>

<style>

</style>
