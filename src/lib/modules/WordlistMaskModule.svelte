<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';
    import InputBox from '../InputBox.svelte';

    export let info = {};
</script>

<p>Mask to append</p>
<InputBox bind:value={info.mask}/>
<spacer/>
<p>Currently supports ?d for digits, ?w for original word, ?? for actual question mark, and ?l for lowercase letter</p>

<style>

</style>
