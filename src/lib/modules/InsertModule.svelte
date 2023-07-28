<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';
    import InputBox from '../InputBox.svelte';

    export let info = {};
</script>

<p>String to insert: </p> <InputBox bind:value={info.insert}/>
<spacer/>
<p>Index to insert at: </p> <InputBox bind:value={info.index}/>

<style>
    p { display: inline-block; }
</style>
