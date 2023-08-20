<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';

    import InputBox from '../InputBox.svelte';
    import Dropdown from '../Dropdown.svelte';

    export let info = {};

    info.endian = info.endian ?? "big";
</script>

<p>Endian</p>
<Dropdown bind:value={info.endian} options={["big", "little"]}/>

<style>
    p { display: inline-block; }
</style>
