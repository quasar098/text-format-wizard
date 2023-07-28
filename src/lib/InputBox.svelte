<script lang="ts">
    import { recipeModules } from "./ts/stores";

    export let value = "";

    export let defaultValue = "";

    if (value == "" && defaultValue != "") {
        setTimeout(() => {
            value = defaultValue;
        }, 2)
    }
</script>

<input type="text" bind:value={value} spellcheck="false" on:keydown={() => setTimeout(() => {recipeModules.update(_ => _)}, 20)}/>
