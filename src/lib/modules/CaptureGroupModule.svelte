<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';

    import InputBox from '../InputBox.svelte';

    export let info = {};
</script>

<p>Regex</p>
<InputBox bind:value={info.regex}/>

<p>Capture group index</p>
<InputBox bind:value={info.index}/>

<spacer/>
<p>Note that if the capture group index is out of bounds, undefined will be outputted instead</p>
<spacer/>
<p>Example regex:</p>
<pre>ERR\\s(...)\\s.*</pre>
<p>Example input:</p>
<pre>ERR 418 I'm a teapot</pre>
<p>With the index as 0, the output is 418</p>

<style>

</style>
