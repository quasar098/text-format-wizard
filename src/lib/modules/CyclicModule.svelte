<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';

    import InputBox from '../InputBox.svelte';
    import Dropdown from '../Dropdown.svelte';

    export let info = {};
</script>

<p>Size in bytes: </p> <InputBox bind:value={info.size}/>

<style>
    p { display: inline-block; }
</style>
