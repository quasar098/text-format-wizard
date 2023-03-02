<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';
    import InputBox from '../InputBox.svelte';

    export let info = {};
</script>

<p>Regex present after the insert</p>
<InputBox bind:value={info.after}/>
<spacer/>
<p>String to insert</p>
<InputBox bind:value={info.insert}/>

<style>

</style>
