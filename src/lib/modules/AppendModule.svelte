<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';

    export let info = {};
    export let redo = () => {};
</script>

<p>Text to append</p>
<input type="text" bind:value={info.append} spellcheck="false" autofocus="true" on:keydown={redo}/>

<style>

</style>
