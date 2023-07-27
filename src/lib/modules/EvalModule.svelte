<script lang="ts">
    import { get } from 'svelte/store'
    import { recipeModules } from '../ts/stores';

    import InputBox from '../InputBox.svelte';
    import Dropdown from '../Dropdown.svelte';

    export let info = { code: "" };

    // if using dropdown, set a default
    // info.method = info.method ?? "decode";
</script>

<p>var text = &lt;input text&gt;</p>
<p>var output = "";</p>
<br>
<textarea bind:value={info.code} class="text" spellcheck="false"></textarea>
<br>
<br>
<p>return output;</p>

<style>
    textarea {
        resize: none;
        width: calc(100% - 22.5px);
        height: 200px;
        border: 1px solid black;
        border-radius: 4px;
        padding: 10px;
        outline: none;
        transition: 0.2s border;
        font-variant-ligatures: none;
        background-color: var(--TEXTAREA-BOXES);
        overflow-y: auto;
    }
    textarea {
        -ms-overflow-style: none;  /* Internet Explorer 10+ */
        scrollbar-width: none;  /* Firefox */
    }
    textarea::-webkit-scrollbar {
        display: none;
    }
    textarea:focus {
        border: 1px solid var(--FOCUSED);
    }
</style>
