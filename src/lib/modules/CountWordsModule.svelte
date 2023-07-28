<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';
    import InputBox from '../InputBox.svelte';

    export let info = { };
</script>

<p>Word is defined as meeting regex /\w+(?:'\w+)?/g</p>

<style>

</style>
