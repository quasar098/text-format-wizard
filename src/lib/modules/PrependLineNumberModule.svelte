<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';

    import InputBox from '../InputBox.svelte';
    import Dropdown from '../Dropdown.svelte';

    export let info = {};

    // if using dropdown, set a default
    info.format = info.format ?? "%number%.\\t%line%";
</script>

<p>Format: </p> <InputBox bind:value={info.format} defaultValue="%number%.\\t%line%"/>

<style>
    p { display: inline-block; }
</style>
