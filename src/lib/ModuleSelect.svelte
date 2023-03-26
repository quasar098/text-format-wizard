<script lang="ts">
    import { ModuleType, moduleMetadata } from './ts/master.ts';
    import Tooltipable from './Tooltipable.svelte';
    import { showAddModuleModal, addModuleModalInfo } from './ts/stores';
    import cssVars from 'svelte-css-vars';

    export let type: ModuleType;
    export let maxWidth: string = "100";
    export let onclick = () => {};

    let metadata = moduleMetadata[type];
    function doStuff(e) {
        if (e.keyCode == 32 || e.keyCode == undefined) {
            $addModuleModalInfo = {moduleType: type, moduleName: metadata.name};
            $showAddModuleModal = true;
        }
        onclick();
    }

    $: styleVars = {
        "title-color": `#${metadata.color}`,
        "desc-color": `#${metadata.color}99`
    }
</script>

<div class="module-select" use:cssVars={styleVars}>
    <Tooltipable text={metadata.description} icon="Info">
        <div class="small add-button" on:click={doStuff} on:keydown={doStuff}>
            <p class="plus">
                +
            </p>
        </div>
    </Tooltipable>
    <div class="big">
        <div class="module-title">
            <h3>{metadata.name}</h3>
        </div>
        <div class="module-description">
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
        justify-content: start;
        align-items: stretch;
        margin-bottom: 5px;
        margin-top: 3px;
        width: calc(100% - 16px);
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
        height: 100%;
    }
    .small:hover {
        background-color: var(--FOCUSED);
        outline: none;
    }
    .big {
        width: calc(100% - 20px);
        display: inline-block;
    }
    .module-title {
        border-top-right-radius: 4px;
        padding: 5px;
        background-color: var(--title-color);
    }
    .module-description {
        background-color: var(--desc-color);
        box-shadow: inset 0px 0px 0.4rem rgba(0, 0, 0, 0.3);
        border-bottom-right-radius: 4px;
        padding: 5px;
    }
</style>
