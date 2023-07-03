<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';

    import InputBox from '../InputBox.svelte';
    import Dropdown from '../Dropdown.svelte';

    export let info = {};

    info.method = info.method ?? "decode";
</script>

<p>Method to use</p>
<Dropdown bind:value={info.method} options={["encode", "decode"]}/>

<style>

</style>
