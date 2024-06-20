<script lang="ts">
    import { recipeModules, lastInputText } from "./ts/stores";
    import { calculate } from "./ts/master";
    import Frame from "./Frame.svelte";
    import ResizeInOutFrames from "./ResizeInOutFrames.svelte";

    $: inputText = "";

    $: {
        $lastInputText = inputText;
    }

    try {
        let decodedFragment = JSON.parse(atob(window.location.hash.slice(1)));
        if (!Array.isArray(decodedFragment)) {
            if (typeof decodedFragment.input === "string") {
                inputText = decodedFragment.input;
                setTimeout(() => {
                    inputText = decodedFragment.input;
                }, 30);
            }
        }
    } catch {}

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

    const isSmartEditor = false;

    function textareaEventHandle(e) {
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

<Frame title="> Input" bind:width={inWindowX} overflow="hidden">
    <textarea spellcheck="false" class="text" bind:value={inputText} on:keydown={textareaEventHandle}/>
</Frame>
<ResizeInOutFrames bind:xposition={bottomAreaXposition}/>
<Frame title="> Output" bind:width={outWindowX} overflow="hidden">
    <div on:click={triplePower} class="fullsize">
        <textarea spellcheck="false" class="out text"
        disabled="true" bind:value={outputText}></textarea>
    </div>
</Frame>

<style>
    .fullsize {
        width: 100%;
        height: 100%;
    }
    textarea {
        resize: none;
        width: calc(100% - 22.5px);
        height: calc(100% - 22.5px);
        border: 1px solid black;
        border-radius: 4px;
        padding: 10px;
        outline: none;
        transition: 0.2s border;
        font-variant-ligatures: none;
        font-size: 13.33333px;
        background-color: var(--TEXTAREA-BOXES);
        overflow-y: auto;
        word-break: break-all;
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
</style>
