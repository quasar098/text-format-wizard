<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';
    import Dropdown from '../Dropdown.svelte';

    export let info = {};

    info.algorithm = info.algorithm ?? "sha256";
</script>

<Dropdown bind:value={info.algorithm} options={["sha256", "md5", 'crc32']}/>

<style>

</style>
