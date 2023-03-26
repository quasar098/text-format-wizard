<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';
    import InputBox from '../InputBox.svelte';

    export let info = { };
</script>

<p>Number of times to duplicate</p>
<InputBox bind:value={info.amount}/>

<style>

</style>
