<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';

    import InputBox from '../InputBox.svelte';

    export let info = {};
</script>

<p>Regex to find and change case of</p>
<InputBox bind:value={info.regex}/>
<spacer/>

<p>New case (upper/lower/flipflop/keep)</p>
<InputBox bind:value={info.newcase}/>

<style>

</style>
