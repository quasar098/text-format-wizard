<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';
    import InputBox from '../InputBox.svelte';

    export let info = { };
</script>

<p>Excluded chars:</p>
<InputBox bind:value={info.excluded}/>
<spacer/>
<p>Keep in mind that \n is a newline character</p>

<style>

</style>
