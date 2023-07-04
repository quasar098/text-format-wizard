<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';

    import InputBox from '../InputBox.svelte';
    import Dropdown from '../Dropdown.svelte';

    export let info = {};

</script>

<p>Pass in the hex value as input text. Must be 6 hexdigits long</p>

<style>

</style>
