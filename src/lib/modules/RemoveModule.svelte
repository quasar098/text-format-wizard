<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';

    import InputBox from '../InputBox.svelte';

    export let info = {};
</script>

<p>Regex search to remove: </p> <InputBox bind:value={info.remove}/>

<style>
    p { display: inline-block; }
</style>
