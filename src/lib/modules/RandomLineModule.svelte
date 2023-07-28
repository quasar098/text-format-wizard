<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';

    import InputBox from '../InputBox.svelte';

    export let info = {};

    function reroll() {
        info.random = Math.random();
    }
</script>

<p>Chooses a random line. </p> <button on:click={reroll}>Reroll</button>

<style>
    p { display: inline-block; }
</style>
