<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';

    import InputBox from '../InputBox.svelte';
    import Dropdown from '../Dropdown.svelte';

    export let info = {};
</script>

<p>Amount to generate: </p> <InputBox bind:value={info.amount}/>

<style>
    p { display: inline-block; }
</style>
