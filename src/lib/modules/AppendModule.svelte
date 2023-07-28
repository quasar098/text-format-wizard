<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';

    import InputBox from '../InputBox.svelte';

    export let info = {};
</script>

<p>String to append:</p> <InputBox bind:value={info.append}/>

<style>
    p { display: inline-block; }
</style>
