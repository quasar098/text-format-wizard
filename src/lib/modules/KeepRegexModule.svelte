<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';

    import InputBox from '../InputBox.svelte';

    export let info = {};
</script>

<p>Regex: </p> <InputBox bind:value={info.regex}/>
<spacer/>
<p>Output format: </p> <InputBox bind:value={info.format}/>

<style>
    p { display: inline-block; }
</style>
