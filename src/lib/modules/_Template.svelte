<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';

    import InputBox from '../InputBox.svelte';
    import Dropdown from '../Dropdown.svelte';

    export let info = {};

    // if using dropdown, set a default
    // info.method = info.method ?? "decode";
</script>

<!-- <p><something></p> -->
<!-- <InputBox bind:value={info.<something>}/> -->
<!-- <Dropdown bind:value={info.<something>} options={["<option1>", "<option2>"]}/> -->

<style>
    p { display: inline-block; }
</style>
