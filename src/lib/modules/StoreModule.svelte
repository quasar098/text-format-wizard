<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';

    import InputBox from '../InputBox.svelte';
    import Dropdown from '../Dropdown.svelte';

    export let info = {};
</script>

<p>Register name (reference with %v&lt;name&gt;%): </p> <InputBox bind:value={info.name}/>

<style>
    p { display: inline-block; }
</style>
