<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';
    import InputBox from '../InputBox.svelte';

    export let info = {};
</script>

<p>Valid algorithms are:<br>
md5, sha256</p>
<spacer/>
<p>Which hash algorithm</p>
<InputBox bind:value={info.algorithm}/>

<style>

</style>
