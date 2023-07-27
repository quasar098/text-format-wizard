<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';
    import InputBox from '../InputBox.svelte';

    export let info = {};
</script>

<p>String to XOR with text (like pwntools xor)</p>
<InputBox bind:value={info.key}/>

<style>

</style>
