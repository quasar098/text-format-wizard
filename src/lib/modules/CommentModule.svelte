<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';
    import InputBox from '../InputBox.svelte';

    export let info = {};
</script>

<p>Comment title (empty for none)</p>
<InputBox bind:value={info.title}/>

<p>Comment description</p>
<InputBox bind:value={info.description}/>

<style>

</style>
