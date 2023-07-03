<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';
    import Dropdown from '../Dropdown.svelte';

    export let info = {};

    info.method = info.method ?? "decrypt";
</script>

<p>What to do</p>
<Dropdown bind:value={info.method} options={["encrypt", "decrypt"]}/>
