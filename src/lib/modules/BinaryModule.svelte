<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';
    import Dropdown from '../Dropdown.svelte';

    export let info = {};

    info.method = info.method ?? "decode";
</script>

<Dropdown bind:value={info.method} options={["encode", "decode"]}/>
