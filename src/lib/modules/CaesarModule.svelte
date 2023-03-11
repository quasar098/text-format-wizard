<script lang="ts">
    import { get } from 'svelte/store'
    import { ModuleType } from "../ts/master";
    import { recipeModules } from '../ts/stores';
    import InputBox from '../InputBox.svelte';

    export let info = {};
</script>

<p>Shift amount</p>
<InputBox bind:value={info.shift}/>

<style>

</style>
