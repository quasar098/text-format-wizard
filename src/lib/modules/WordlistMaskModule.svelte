<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';
    import InputBox from '../InputBox.svelte';

    export let info = {};
</script>

<p>Mask to append</p>
<InputBox bind:value={info.mask}/>
<spacer/>
<p>
Currently supports: <br>
?d for digits<br>
?w for original word<br>
?? for actual question mark<br>
?s for special char<br>
?u for uppercase<br>
?l for lowercase letter<br>
?a for alphanumeric (lowercase and uppercase)
<spacer/>
?d is different than ?D because ?D means there's always going to be a digit,<br>
but ?d represents digits 0-9, and also an empty string (just in case it doesn't exist)
<spacer/>
Example:
<pre>
?W?D?d
</pre>
This example mask will try all original words and trail 1 and 2 digits.<br>
Result if only word in Input was "qwerty":
<pre>
qwerty0
qwerty1
qwerty2
... cont ...
qwerty8
qwerty9
qwerty00
qwerty01
qwerty02
... cont ...
qwerty97
qwerty98
qwerty99
</pre>
</p>

<style>

</style>
