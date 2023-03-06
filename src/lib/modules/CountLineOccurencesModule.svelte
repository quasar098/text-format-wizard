<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';
    import InputBox from '../InputBox.svelte';

    export let info = { };
</script>

<p>Format of output text:</p>
<InputBox bind:value={info.format}/>

<p>An example format would be:</p>
<pre>%line%: %count%</pre>

<style>

</style>
