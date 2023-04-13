<script lang="ts">
    import { get } from 'svelte/store'
    import { ModuleType } from "../ts/master";
    import { recipeModules } from '../ts/stores';
    import Dropdown from '../Dropdown.svelte';

    export let info = {};

    info.method = info.method ?? "decode";
</script>

<p>What to do</p>
<Dropdown bind:value={info.method} options={["encode", "decode"]}/>
