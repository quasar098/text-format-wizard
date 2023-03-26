<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';

    import InputBox from '../InputBox.svelte';

    export let info = {};
</script>

<p>Regex</p>
<InputBox bind:value={info.regex}/>

<p>Output format</p>
<InputBox bind:value={info.format}/>

<spacer/>
<p>Only keeps text that matches the regex, formats it, and seperates them by newlines</p>
<spacer/>
<p>If you need to keep non-matching data, use Regex Replace instead</p>
<spacer/>
<spacer/>
<spacer/>
<spacer/>
<h4>Example:<spacer/></h4>
<p>
Regex:</p>
<pre>ERR\s(...)\s(.*)</pre>
<p>Format:</p>
<pre>[%0%]: %1%</pre>
<p>Input:</p>
<pre>ERR 418 I'm a teapot</pre>
<p>Output:</p>
<pre>[418]: I'm a teapot</pre>

<style>
    h4 {
        font-size: 18px;
        font-style: italic;
    }
</style>
