<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';

    export let info = {};
    export let redo = () => {};
</script>

<p>Text to insert</p>
<input type="text" bind:value={info.insert} spellcheck="false" autofocus="true" on:keydown={redo}/>
<spacer/>
<p>Index to insert at</p>
<input type="text" bind:value={info.index} spellcheck="false" on:keydown={redo}/>

<style>

</style>
