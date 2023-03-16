<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';

    import InputBox from '../InputBox.svelte';

    import Dropdown from '../Dropdown.svelte';

    export let info = {};

    info.newcase = info.newcase ?? "keep";
</script>

<p>Regex to find and change case of</p>
<InputBox bind:value={info.regex}/>
<spacer/>

<p>New case</p>
<Dropdown bind:value={info.newcase} options={["upper", "lower", "flipflop", "keep", "random"]}/>

<style>

</style>
