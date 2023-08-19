<script lang="ts">
    import { reprCalculatorNumber, calculatorRepr, CalculatorRepr } from "../ts/calculator.ts";
    import { calculatorRows } from "../ts/calculator.ts";
    import Tooltipable from "../Tooltipable.svelte";
    export let row = {};

    $: repr = reprCalculatorNumber(row.original);

    $: reprText = repr[CalculatorRepr[$calculatorRepr].toLowerCase()];

    function copyNumber(copyType: string): void {
        window.navigator.clipboard.writeText(repr[copyType]);
    }

    function deleteSelfRow(): void {
        $calculatorRows = $calculatorRows.filter(_ => _ != row);
    }
</script>

<div class='calc-row'>
    <p class="row-number text">{reprText}</p>
    <div class="row-buttons">
        <div class='button text' on:click={deleteSelfRow}></div>
        <Tooltipable text="Copy binary number" icon="Info">
            <div class='button text' on:click={() => copyNumber('binary')}>0b</div>
        </Tooltipable>
        <Tooltipable text="Copy octal number" icon="Info">
            <div class='button text' on:click={() => copyNumber('octal')}>0o</div>
        </Tooltipable>
        <Tooltipable text="Copy decimal number" icon="Info">
            <div class='button text' on:click={() => copyNumber('decimal')}>0d</div>
        </Tooltipable>
        <Tooltipable text="Copy hex number" icon="Info">
            <div class='button text' on:click={() => copyNumber('hex')}>0x</div>
        </Tooltipable>
    </div>
</div>

<style>
    .button {
        width: 36px;
        height: 36px;
        text-align: center;
        font-size: 20px;
        line-height: 36px;
        user-select: none;
        margin: 2px;
        cursor: pointer;
        background-color: #88888844;
        transition-duration: 0.2s;
        transition-property: background-color;
        border-radius: 1px;
    }
    .button:hover {
        background-color: var(--FOCUSED);
    }
    .calc-row {
        width: calc(100% - 10px);
        display: flex;
        flex-direction: row;
        align-items: center;
        padding-left: 10px;
        height: 40px;
        border-bottom: 1px solid #121212;
    }
    .row-number {
        display: inline-block;
        width: 75%;
        height: 16px;
        margin: 0px;
        overflow-x: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow-y: clip;
    }
    .row-buttons {
        width: 25%;
        height: 40px;
        display: flex;
        flex-direction: row-reverse;
    }
</style>
