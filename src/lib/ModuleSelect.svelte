<script lang="ts">
    import { ModuleType, moduleMetadata } from './ts/types.ts'
    export let type: ModuleType;
    export let addModalInfo = undefined;
    let metadata = moduleMetadata[type];
    function doStuff(e) {
        if (e.keyCode == 32 || e.keyCode == undefined) {
            addModalInfo = {moduleType: type};
        }
    }
</script>

<div class="module-select">
    <div class="small add-button" on:click={doStuff} tabindex="1" on:keydown={doStuff}>
        <p class="plus">
            +
        </p>
    </div>
    <div class="big">
        <div class="module-title" style="background-color: #{metadata.color}">
            <h3>{metadata.name}</h3>
        </div>
        <div class="module-description" style="background-color: #{metadata.color}99">
            <p>{metadata.lore}</p>
        </div>
    </div>
</div>

<style>
    h3 {
        font-size: 18px;
    }
    h3, p {
        display: inline;
    }
    p.plus {
        font-size: 24px;
    }
    .module-select {
        display: flex;
        justify-content: center;
        align-items: stretch;
        margin-bottom: 3px;
        margin-top: 3px;
    }
    .small {
        width: 30px;
        display: flex;
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
    .small:focus-visible,.small:active {
        background-color: var(--FOCUSED);
        outline: none;
    }
    .big {
        width: calc(100% - 20px);
        display: inline-block;
    }
    ::selection {
        color: white;
        background-color: var(--BG-COLOR);
    }
    .module-title {
        border-top-right-radius: 4px;
        padding: 5px;
    }
    .module-description {
        box-shadow: inset 0px 0px 0.4rem rgba(0, 0, 0, 0.3);
        border-bottom-right-radius: 4px;
        padding: 5px;
    }
</style>
