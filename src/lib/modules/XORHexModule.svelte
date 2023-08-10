<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';
    import InputBox from '../InputBox.svelte';

    export let info = {};
</script>

<p>Hex to XOR with text (e.g. 77656972642070617373776f7264): </p> <InputBox bind:value={info.key}/>

<style>
    p { display: inline-block; }
</style>
