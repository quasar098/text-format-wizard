<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';
    import InputBox from '../InputBox.svelte';

    export let info = { };
</script>

<p>Regex to match:</p> <InputBox bind:value={info.regex}/>

<style>
    p { display: inline-block; }
</style>
