<script lang="ts">
    import { reprCalculatorNumber } from "../ts/calculator.ts";
    export let row = {};

    $: repr = reprCalculatorNumber(row.original);
</script>

<div class='calc-row'>
    <p class="row-text text">{repr.binary} | {repr.hex} | {repr.octal}</p>
</div>

<style>
    .calc-row {
        width: calc(100% - 10px);
        display: flex;
        flex-direction: row;
        align-items: center;
        padding-left: 10px;
        height: 40px;
        border-bottom: 1px solid #121212;
    }
    .row-text {
        display: inline-block;
        height: 16px;
        margin: 0px;
    }
</style>
