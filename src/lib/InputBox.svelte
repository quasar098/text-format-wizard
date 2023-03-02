<script lang="ts">
    import { recipeModules } from "./ts/stores";

    export let value = "";
</script>

<input type="text" bind:value={value} spellcheck="false" on:keydown={() => setTimeout(() => {recipeModules.update(_ => _)}, 20)}/>
