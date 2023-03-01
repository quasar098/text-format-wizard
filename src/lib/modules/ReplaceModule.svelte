<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';

    export let info = {};
    export let redo = () => {};
</script>

<p>Regex to replace</p>
<input type="text" bind:value={info.remove} spellcheck="false" autofocus="true" on:keydown={redo}/>
<spacer/>
<p>String to insert</p>
<input type="text" bind:value={info.insert} spellcheck="false" on:keydown={redo}/>

<style>

</style>
