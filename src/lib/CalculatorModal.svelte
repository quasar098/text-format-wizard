<script lang="ts">
    import { get } from "svelte/store";
    import Frame from "./Frame.svelte";
    import { getOpenModal, closeAllModals, openModal, modalStackInstanceId } from './ts/modal.ts';
    import { fadeBgIn, fadeBgOut, discordIn, discordOut } from "./ts/transitions.ts";
    import { calculatorRows, newCalculatorRow, calculatorRowInstanceId } from "./ts/calculator.ts";
    import CalculatorRowComponent from "./calculator/CalculatorRow.svelte";

    function keyDownHandler(e): void {
        if (e.keyCode == 27) {
            closeAllModals();
            document.activeElement.blur();
        }
        if (e.keyCode == 85 && e.shiftKey && e.ctrlKey) {
            closeAllModals();
            openModal(4);
            e.preventDefault(true);
        }
    }

    function keyDownInAddRowInput(e): void {
        if (e.keyCode == 13) {
            clickOnAddRowButton(e);
        }
    }

    let newRowInput: string;
    $: newRowInput = "";

    function clickOnAddRowButton(e): void {
        if (newRowInput.length == 0) {
            return;
        }
        if (!/^([0-9]+|(?:0b)?[01]+|(?:0x)?[0-9a-f]+|(?:0o)?[0-7]+)$/.test(newRowInput)) {
            alert("Does not match!");
            return;
        }
        $calculatorRows.push(newCalculatorRow(newRowInput));
        calculatorRowInstanceId.update(i => i + 1)
        if (!e.shiftKey) {
            newRowInput = "";
        }
    }
</script>

<svelte:body on:keydown={keyDownHandler}/>

{#key $modalStackInstanceId}
    {#if getOpenModal(4)}
        <div class="outer-modal" in:fadeBgIn out:fadeBgOut>
            <div class="modal">
                <Frame title='> Calculator' onclose={closeAllModals}
                    enterTransition={discordIn} exitTransition={discordOut}>

                    <div class='rows'>
                        {#key $calculatorRowInstanceId}
                            {#each $calculatorRows as row, i}
                                <CalculatorRowComponent bind:row={row}/>
                            {/each}
                        {/key}
                    </div>

                    <div class='controls'>
                        <div class="add-row">
                            <div class="add-row-button" on:click={clickOnAddRowButton}>
                                <p class="plus">
                                    +
                                </p>
                            </div>
                            <div class="add-row-parent">
                                <input type="text" name="tfw-add-calc-row" bind:value={newRowInput}
                                       on:keydown={keyDownInAddRowInput} placeholder="Add number" class="text add-row-input"/>
                            </div>
                        </div>
                    </div>

                </Frame>
            </div>
        </div>
    {/if}
{/key}

<style>
    .outer-modal {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        z-index: 100;
        background-color: #00000044;
    }
    .rows {
        background-color: #00000011;
        width: calc(100% - 20px);
        height: calc(100% - 320px);
        margin: 10px;
        border: 1px solid black;
        border-radius: 4px;
    }
    .controls {
        width: calc(100% - 20px);
        margin-left: 10px;
        height: 290px;
    }
    .modal {
        width: calc(100% - 150px);
        height: calc(100% - 150px);
        margin-left: 75px;
        margin-top: 75px;
    }
    .add-row-parent {
        display: inline;
    }
    .add-row-input {
        border-radius: 4px;
        padding: 10px;
        margin-left: -10px;
        margin-top: -5px;
        outline: none;
        display: inline;
        width: calc(25% - 45px);
        transition: 0.2s;
        transition-property: border;
        border: 1px solid black;
        border-left: 0px solid;
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
        background-color: var(--TEXTAREA-BOXES);
        transform: translateY(-3px);
    }
    .add-row-input::placeholder {
        color: var(--TEXT-COLOR);
    }
    .add-row-input:focus {
        border: 1px solid var(--FOCUSED);
        border-left: 0px solid;
    }
    .add-row-button:hover {
        background-color: var(--FOCUSED);
        outline: none;
    }
    .add-row-button {
        width: 30px;
        height: 38px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        background-color: white;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        box-shadow: inset 0px 0px 0.4rem rgba(0, 0, 0, 0.2);
        border-right: none;
        cursor: pointer;
        user-select: none;
        transition: 0.2s background-color;
    }
    .plus {
        font-size: 24px;
    }
</style>
