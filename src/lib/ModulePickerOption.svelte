<script lang="ts">
    export let id = "00000000-0000-0000-0000-000000000000";
    export let picked;

    import { moduleMetadata } from "./ts/types";
    import cssVars from 'svelte-css-vars';
    
    let metadata = moduleMetadata[id] ?? {};

    function setAsPicked() {
        picked.moduleType = id;
        picked.args = {};
    }

    $: styleVars = {
        "bg-color": `#${metadata.color}`,
        "border-color": `#${picked.moduleType == id ? 'black' : metadata.color}`
    }
</script>

<div class="poption" use:cssVars={styleVars} on:click={setAsPicked} on:keydown={setAsPicked}>
    <p>{metadata.name}</p>
</div>

<style>
    .poption {
        border-radius: 4px;
        margin: 3px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 2px solid black;
        cursor: pointer;
        user-select: none;
        width: calc(100% - 20px);
        background-color: var(--bg-color);
        border-color: var(--border-color);
    }
</style>
