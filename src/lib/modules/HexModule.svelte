<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';
    import Dropdown from '../Dropdown.svelte';

    export let info = {};

    info.method = info.method ?? "decode";
    info.encoding = info.encoding ?? "utf8";
</script>

<div class="side-by-side">
    <Dropdown bind:value={info.method} options={["encode", "decode"]}/>
    <Dropdown bind:value={info.encoding} options={["utf8", "latin1"]}/>
</div>

<style>
    div.side-by-side {
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: start;
        gap: 5px;
    }
</style>
