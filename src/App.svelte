<script lang="ts">
    import Frame from "./lib/Frame.svelte";
    import ModuleSelect from "./lib/ModuleSelect.svelte";
    import ModulePreview from "./lib/ModulePreview.svelte";
    import AddModuleModal from "./lib/AddModuleModal.svelte";
    import ResizeInOutFrames from "./lib/ResizeInOutFrames.svelte";
    import Toolbar from "./lib/Toolbar.svelte";
    import cssVars from 'svelte-css-vars';

    import { Svroller } from "svrollbar";

    import { recipeModules } from "./lib/ts/stores";
    import { ModuleType, calculate, moduleMetadata,
        uuidRegex, sortedModuleTypes } from './lib/ts/types';

    let addModalInfo = undefined;

    $: inputText = "";
    $: outputText = calculate(inputText, undefined);

    recipeModules.subscribe(() => {
        outputText = calculate(inputText, undefined);
    });

    function insertAtCursor(myField, myValue) {
        // IE support
        if (document.selection) {
            myField.focus();
            sel = document.selection.createRange();
            sel.text = myValue;
        }
        // MOZILLA and others
        else if (myField.selectionStart || myField.selectionStart == '0') {
            var startPos = myField.selectionStart;
            var endPos = myField.selectionEnd;
            myField.value = myField.value.substring(0, startPos)
                + myValue
                + myField.value.substring(endPos, myField.value.length);
            myField.selectionStart = startPos+4;
            myField.selectionEnd = endPos+4;
        } else {
            myField.value += myValue;
        }
    }

    const isSmartEditor = true;

    function textareaEventHandle(e) {
        if (e.keyCode == 70 && e.ctrlKey) {  // ctrl f
            e.preventDefault(true);
            return false;
        }
        if (isSmartEditor) {
            if (e.keyCode == 9) {  // tab
                if (!e.shiftKey) {
                    if (this.selectionEnd == this.selectionStart) {
                        insertAtCursor(this, "    ");
                    }
                }
                e.preventDefault(true);
                return false;
            }
            if ("\"'".includes(e.key)) {  // pressing " with selection -> "stuff here"
                if (e.ctrlKey) {
                    return;
                }
                let oldStart = this.selectionStart;
                let oldEnd = this.selectionEnd;
                this.value = this.value.slice(0, this.selectionStart) + e.key +
                    this.value.slice(this.selectionStart);
                if (oldStart == oldEnd) {
                    this.selectionStart = oldStart;
                    this.selectionEnd = oldEnd;
                } else {
                    setTimeout(() => {
                        this.select();
                        this.selectionStart = oldStart+1;
                        this.selectionEnd = oldEnd+1;
                    }, 1)
                }
            }
            if ("({[".includes(e.key)) {
                if (e.ctrlKey) {
                    return;
                }
                let oldStart = this.selectionStart;
                let oldEnd = this.selectionEnd;
                let other = ")}]"["({[".indexOf(e.key)];
                this.value = this.value.slice(0, this.selectionStart) + e.key +
                    this.value.slice(this.selectionStart);
                if (oldStart == oldEnd) {
                    this.selectionStart = oldStart + 1;
                    this.selectionEnd = oldEnd + 1;
                } else {
                    setTimeout(() => {
                        this.select();
                        this.selectionStart = oldStart+1;
                        this.selectionEnd = oldEnd+1;
                    }, 1)
                }
                this.value = this.value.slice(0, this.selectionStart) + other +
                    this.value.slice(this.selectionStart);
                if (oldStart == oldEnd) {
                    this.selectionStart = oldStart + 1;
                    this.selectionEnd = oldStart + 1;
                }
                e.preventDefault(true);
                return false;
            }
        }
    }

    function triplePower(e) {
        if (e.detail == 3) {
            this.firstChild.disabled = false;
            this.firstChild.select()
            this.firstChild.disabled = true;
        }
    }

    let bottomAreaXposition = Math.floor(window.innerWidth/2);

    $: inWindowX = Math.floor((bottomAreaXposition)/window.innerWidth*1000)/10;
    $: outWindowX = 95-Math.floor((bottomAreaXposition)/window.innerWidth*1000)/10;
</script>

<main>
    <AddModuleModal bind:addModalInfo/>

    <div class="top">
        <Frame title="Recipe" width=60 height="100% + 10px">
            {#each $recipeModules as item, index}
                <ModulePreview bind:moduleObject={item}/>
            {:else}
                <p>No modules are in this recipe</p>
            {/each}
        </Frame>
        <Frame title="Modules" width=40 height="100% + 10px">
            <Svroller width="100%" height="100%" alwaysVisible="true">
                {#each sortedModuleTypes() as value, index}
                    <ModuleSelect type={value} bind:addModalInfo>
                    </ModuleSelect>
                {/each}
            </Svroller>
        </Frame>
    </div>

    <div class="bottom">
        <Frame title="Input" bind:width={inWindowX} overflow="hidden">
            <textarea spellcheck="false" bind:value={inputText} on:keydown={textareaEventHandle}/>
        </Frame>
        <ResizeInOutFrames bind:xposition={bottomAreaXposition}/>
        <Frame title="Output" bind:width={outWindowX} overflow="hidden">
            <div on:click={triplePower} class="fullsize">
                <textarea spellcheck="false" class="out"
                disabled="true" bind:value={outputText}></textarea>
            </div>
        </Frame>
        <Frame title="󱌣" width=5 alignment="center" overflow="hidden">
            <Toolbar/>
        </Frame>
    </div>

</main>

<style>
    textarea {
        resize: none;
        width: calc(100% - 22.5px);
        height: calc(100% - 22.5px);
        border: 1px solid black;
        border-radius: 4px;
        padding: 10px;
        outline: none;
        transition: 0.2s;
        font-variant-ligatures: none;
        background-color: white;
        color: black;
        overflow-y: auto;
    }
    textarea {
        -ms-overflow-style: none;  /* Internet Explorer 10+ */
        scrollbar-width: none;  /* Firefox */
    }
    textarea::-webkit-scrollbar {
        display: none;
    }
    textarea.out {
        cursor: text;
    }
    textarea:focus {
        border: 1px solid var(--FOCUSED);
    }
    .fullsize {
        width: 100%;
        height: 100%;
    }
    .top {
        height: 55%;
    }
    .bottom {
        height: 45%;
    }
    main {
        height: 100%;
    }
</style>
