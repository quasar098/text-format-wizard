<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';
    import Dropdown from '../Dropdown.svelte';

    export let info = {};

    info.algorithm = info.algorithm ?? "sha256";
</script>

<p>Which hash algorithm</p>
<Dropdown bind:value={info.algorithm} options={["sha256", "md5"]}/>

<style>

</style>
