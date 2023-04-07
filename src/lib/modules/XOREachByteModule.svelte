<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';
    import InputBox from '../InputBox.svelte';

    export let info = {};
</script>

<p>Byte value to XOR by (0-255)</p>
<InputBox bind:value={info.value}/>

<style>

</style>
