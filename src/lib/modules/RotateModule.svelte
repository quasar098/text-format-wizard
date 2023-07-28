<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';

    import InputBox from '../InputBox.svelte';

    export let info = {};
</script>

<p>Amount to rotate: </p> <InputBox bind:value={info.rotate}/>

<style>
    p { display: inline-block; }
</style>
