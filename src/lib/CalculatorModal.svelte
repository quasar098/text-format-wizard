<script lang="ts">
    import { get } from "svelte/store";
    import Frame from "./Frame.svelte";
    import { getOpenModal, closeAllModals, openModal, modalStackInstanceId } from './ts/modal.ts';
    import { fadeBgIn, fadeBgOut, discordIn, discordOut } from "./ts/transitions.ts";
    import { calculatorRows, newCalculatorRow, calculatorRowInstanceId } from "./ts/calculator.ts";
    import { calculatorSize, calculatorSigning, calculatorRepr } from "./ts/calculator.ts";
    import { CalculatorSize, CalculatorSigning, CalculatorRepr } from "./ts/calculator.ts";
    import { checkKeybind, Setting } from "./ts/settings.ts";
    import CalculatorRowComponent from "./calculator/CalculatorRow.svelte";
    import Tooltipable from "./Tooltipable.svelte";
    import cssVars from 'svelte-css-vars';

    function keyDownHandler(e): void {
        if (getOpenModal(4)) {
            if (e.keyCode == 27) {
                closeAllModals();
                document.activeElement.blur();
            }
            if (checkKeybind(e, Setting.CalculatorKeybind)) {
                e.preventDefault(true);
            }
        } else {
            if (checkKeybind(e, Setting.CalculatorKeybind)) {
                closeAllModals();
                openModal(4);
                e.preventDefault(true);
            }
        }
    }

    function keyDownInAddRowInput(e): void {
        if (e.keyCode == 13) {
            clickOnAddRowButton(e);
        }
    }

    let newRowInput: string;
    $: newRowInput = "";

    let isValidNewRowInput: boolean;
    $: isValidNewRowInput = /^((?:0d)?[0-9]+|0b[01]+|0x[0-9a-f]+|0o[0-7]+)$/.test(newRowInput);

    function clickOnAddRowButton(e): void {
        if (newRowInput.length == 0) {
            return;
        }
        if (!/^((?:0d)?[0-9]+|0b[01]+|0x[0-9a-f]+|0o[0-7]+)$/.test(newRowInput)) {
            alert("Invalid number!");
            return;
        }
        $calculatorRows.push(newCalculatorRow(newRowInput));
        calculatorRowInstanceId.update(i => i + 1)
        if (!e.shiftKey) {
            newRowInput = "";
        }
    }

    function clearNewRowText(): void {
        if (!isValidNewRowInput) {
            newRowInput = "";
        }
    }

    function classForCalculatorRepr(reprType: string): boolean {
        return CalculatorRepr[reprType] == $calculatorRepr ? 'active' : 'inactive';
    }

    function classForCalculatorMode(signed: boolean, size: string): string {
        return (CalculatorSize[size] == $calculatorSize && $calculatorSigning == +signed) ? 'active' : 'inactive';
    }

    function getNumberTypeGuess(inp: string): string {
        if (/^0b[01]+$/.test(inp)) {
            return "binary";
        }
        if (/^0x[0-9a-f]+$/.test(inp)) {
            return "hex";
        }
        if (/^0o[0-7]+$/.test(inp)) {
            return "octal";
        }
        return "decimal";
    }

    function setCalculatorSizeAndSigning(signed: boolean, size: string): void {
        $calculatorSigning = +signed;
        $calculatorSize = CalculatorSize[size];
    }

    function setCalculatorRepr(reprType: string): boolean {
        $calculatorRepr = CalculatorRepr[reprType];
    }

    $: numberTypeGuess = getNumberTypeGuess(newRowInput);

    let validNumberTooltip: string;
    $: validNumberTooltip = isValidNewRowInput ? `Valid ${numberTypeGuess} number` : 'Invalid number';
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
                            <div class="add-row-input-parent">
                                <input type="text" name="tfw-add-calc-row" bind:value={newRowInput} spellcheck="false"
                                       on:keydown={keyDownInAddRowInput} placeholder="Add number" class="text add-row-input"/>
                               <Tooltipable text="{validNumberTooltip}" icon="Info">
                                   <p class="{isValidNewRowInput ? 'valid' : 'invalid'} validation" on:click={clearNewRowText}>
                                       {isValidNewRowInput ? '' : ''}
                                   </p>
                               </Tooltipable>
                            </div>
                        </div>

                        <div class="choose-modes box">
                            {#key $calculatorRepr}
                                <div class="choose-repr box">
                                    <div class='choose-repr-option {classForCalculatorRepr('Hex')}'
                                         on:click={() => setCalculatorRepr('Hex')}>
                                        <p class="text">Hex</p>
                                    </div>
                                    <div class='choose-repr-option {classForCalculatorRepr('Decimal')}'
                                         on:click={() => setCalculatorRepr('Decimal')}>
                                        <p class="text">Decimal</p>
                                    </div>
                                    <div class='choose-repr-option {classForCalculatorRepr('Octal')}'
                                         on:click={() => setCalculatorRepr('Octal')}>
                                        <p class="text">Octal</p>
                                    </div>
                                    <div class='choose-repr-option {classForCalculatorRepr('Binary')}'
                                         on:click={() => setCalculatorRepr('Binary')}>
                                        <p class="text">Binary</p>
                                    </div>
                                </div>
                            {/key}
                            {#key $calculatorSize}
                                {#key $calculatorSigning}
                                    <div class="choose-size box">
                                        <div class='uint-sizes'>
                                            <div class='choose-size-option {classForCalculatorMode(false, 'QWord')}'
                                                 on:click={() => setCalculatorSizeAndSigning(false, 'QWord')}>
                                                <p class="text">uint64</p>
                                            </div>
                                            <div class='choose-size-option {classForCalculatorMode(false, 'DWord')}'
                                                 on:click={() => setCalculatorSizeAndSigning(false, 'DWord')}>
                                                <p class="text">uint32</p>
                                            </div>
                                            <div class='choose-size-option {classForCalculatorMode(false, 'Word')}'
                                                 on:click={() => setCalculatorSizeAndSigning(false, 'Word')}>
                                                <p class="text">uint16</p>
                                            </div>
                                            <div class='choose-size-option {classForCalculatorMode(false, 'Byte')}'
                                                 on:click={() => setCalculatorSizeAndSigning(false, 'Byte')}>
                                                <p class="text">uint8</p>
                                            </div>
                                        </div>
                                        <div class='int-sizes'>
                                            <div class='choose-size-option {classForCalculatorMode(true, 'QWord')}'
                                                 on:click={() => setCalculatorSizeAndSigning(true, 'QWord')}>
                                                <p class="text">int64</p>
                                            </div>
                                            <div class='choose-size-option {classForCalculatorMode(true, 'DWord')}'
                                                 on:click={() => setCalculatorSizeAndSigning(true, 'DWord')}>
                                                <p class="text">int32</p>
                                            </div>
                                            <div class='choose-size-option {classForCalculatorMode(true, 'Word')}'
                                                 on:click={() => setCalculatorSizeAndSigning(true, 'Word')}>
                                                <p class="text">int16</p>
                                            </div>
                                            <div class='choose-size-option {classForCalculatorMode(true, 'Byte')}'
                                                 on:click={() => setCalculatorSizeAndSigning(true, 'Byte')}>
                                                <p class="text">int8</p>
                                            </div>
                                        </div>
                                    </div>
                                {/key}
                            {/key}
                        </div>

                    </div>

                </Frame>
            </div>
        </div>
    {/if}
{/key}

<style>
    .active {
        background-color: var(--FOCUSED);
    }
    .inactive {
        background-color: #dddddd;
    }
    .validation {
        position: absolute;
        top: -11px;
        right: 0px;
        font-size: 24px;
        user-select: none;
        cursor: help;
        width: 38px;
        height: 38px;
        text-align: center;
        line-height: 38px;
    }
    .valid {
        color: #b0dfa1;
    }
    .invalid {
        color: #db162f;
    }
    .text {
        display: inline-block;
    }
    .box {
        background-color: #00000011;
        border-radius: 4px;
        border: 1px solid black;
    }
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
        width: calc(100% - 22px);
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
    .add-row-input-parent {
        display: inline;
        position: relative;
    }
    .add-row-input {
        border-radius: 4px;
        padding: 10px;
        padding-right: 35px;
        margin-left: -10px;
        margin-top: -5px;
        outline: none;
        display: inline;
        width: calc(25% - 70px);
        transition: 0.2s;
        transition-property: border;
        border: 1px solid black;
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
        box-shadow: inset 0px 0px 0.4rem rgba(0, 0, 0, 0.14);
        border-right: none;
        cursor: pointer;
        user-select: none;
        transition: 0.2s background-color;
    }
    .plus {
        font-size: 24px;
    }
    .choose-modes {
        width: calc(25% + 5px);
        height: calc(100% - 48px);
        margin-top: 5px;
    }
    .choose-repr-option {
        height: 100%;
        width: 100%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        user-select: none;
        transition-duration: 0.2s;
        box-shadow: inset 0px 0px 0.9rem rgba(0, 0, 0, 0.2);
        transition-property: background-color;
    }
    .choose-repr-option:first-of-type {
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
    }
    .choose-repr-option:last-of-type {
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
    }
    .choose-repr-option:not(:last-of-type) {
        border-bottom: 1px solid black;
    }
    .choose-repr-option:hover {
        background-color: var(--FOCUSED);
        cursor: pointer;
    }
    .choose-repr-option p.text {
        color: black;
    }
    .choose-repr {
        width: calc(35% - 22px);
        height: calc(100% - 22px);
        margin: 10px;
        margin-right: 0px;
        display: inline-flex;
        flex-direction: column;
        justify-content: stretch;
        align-items: center;
    }
    .choose-size {
        width: calc(65% - 12px);
        height: calc(100% - 22px);
        margin: 10px;
        margin-left: 0px;
        display: inline-flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .uint-sizes,.int-sizes {
        display: flex;
        height: 100%;
        width: 100%;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .choose-size-option:hover {
        background-color: var(--FOCUSED);
    }
    .choose-size-option {
        box-shadow: inset 0px 0px 0.9rem rgba(0, 0, 0, 0.2);
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        user-select: none;
        transition-duration: 0.2s;
        transition-property: background-color;
    }
    .choose-size-option p.text {
        color: black;
    }
    .uint-sizes .choose-size-option {
        border-right: 1px solid black;
        z-index: 1;
        border-left: 1px solid black;
    }
    .uint-sizes .choose-size-option:first-of-type {
        border-top-left-radius: 4px;
    }
    .uint-sizes .choose-size-option:last-of-type {
        border-bottom-left-radius: 4px;
    }
    .int-sizes .choose-size-option:first-of-type {
        border-top-right-radius: 4px;
    }
    .int-sizes .choose-size-option:last-of-type {
        border-bottom-right-radius: 4px;
    }
    .uint-sizes .choose-size-option:not(:last-of-type),
    .int-sizes .choose-size-option:not(:last-of-type) {
        border-bottom: 1px solid black;
    }
</style>
