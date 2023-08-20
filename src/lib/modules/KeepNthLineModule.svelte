<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';

    import InputBox from '../InputBox.svelte';
    import Dropdown from '../Dropdown.svelte';

    export let info = {};
</script>

<p>Line to keep: </p> <InputBox bind:value={info.keep}/>

<style>
    p { display: inline-block; }
</style>
