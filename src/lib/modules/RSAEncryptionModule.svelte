<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';

    import InputBox from '../InputBox.svelte';
    import Dropdown from '../Dropdown.svelte';

    export let info = {};

    // if using dropdown, set a default
    // info.method = info.method ?? "decode";
</script>

<p>p: </p> <InputBox bind:value={info.p}/>
<spacer/>
<p>q: </p> <InputBox bind:value={info.q}/>
<spacer/>
<p>e: </p> <InputBox bind:value={info.e}/>

<style>
    p { display: inline-block; }
</style>
