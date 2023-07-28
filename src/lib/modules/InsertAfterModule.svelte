<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';
    import InputBox from '../InputBox.svelte';

    export let info = {};
</script>

<p>Regex present before each insert: </p> <InputBox bind:value={info.before}/>
<spacer/>
<p>String to insert: </p> <InputBox bind:value={info.insert}/>

<style>
    p { display: inline-block; }
</style>
