<script lang="ts">
    import { outputAsJs, recipeModules, colorTheme } from './ts/stores';
    import Tooltipable from './Tooltipable.svelte';
    import { openModal } from './ts/modal';

    function changeJs() {
        outputAsJs.update(_ => !_);
        recipeModules.update(_ => _);
    }

    function clearModules() {
        // todo: change from confirm to custom component
        if (confirm("Are you sure you want to clear all modules?")) {
            recipeModules.set([]);
        }
    }

    function openSearchMenu() {
        openModal(1);
    }

    let themes = [
        {
            name: "Dark",
            properties: {
                "--BG-COLOR": "#4b5362",
                "--ACCENT": "#101010",
                "--FRAME-COLOR": "#343434",
                "--FOCUSED": "#B6CBE4",
                "--TEXTAREA-BOXES": "#2b2b2b",
                "--TEXT-COLOR": "#efefef"
            }
        },
        {
            name: "Light",
            properties: {
                "--BG-COLOR": "#0c1213",
                "--ACCENT": "#e07a5f",
                "--FRAME-COLOR": "#bebebf",
                "--FOCUSED": "#96adc8",
                "--TEXTAREA-BOXES": "#ededed",
                "--TEXT-COLOR": "000000"
            }
        }
    ];

    function changeTheme() {
        $colorTheme = ($colorTheme+1) % themes.length;
        applyCurrentTheme();
    }

    function applyCurrentTheme() {
        for (let property of Object.keys(themes[$colorTheme].properties)) {
            document.body.style.setProperty(property, themes[$colorTheme].properties[property]);
        }
        document.body.setAttribute("theme", themes[$colorTheme].name);
    }

    function exportURL() {
        if ($recipeModules.length != 0) {
            window.location.hash = btoa(JSON.stringify($recipeModules));
        } else {
            window.location.hash = '';
        }
        window.navigator.clipboard.writeText(window.location);
        alert("Copied to clipboard!");
    }

    function keydownHandler(e) {
        if (!e.shiftKey) {
            return;
        }
        if (!e.ctrlKey) {
            return;
        }
        if (e.keyCode == 76) {  // copy recipe URL
            exportURL();
            e.preventDefault(true);
        }
        if (e.keyCode == 68) {  // clear all modules
            clearModules();
            e.preventDefault(true);
        }
        return false;
    }

    applyCurrentTheme();
</script>

<svelte:body on:keydown={keydownHandler}/>

<div class="toolbar">
    <!-- todo: implement settings -->
    <Tooltipable text="Switch Themes" icon="Info">
        <h4 class="icon code" on:click={changeTheme} on:keydown={changeTheme}> <div class="l2">󰃝</div> </h4>
    </Tooltipable>
    <Tooltipable text="Settings (not implemented yet)" icon="Info">
        <h4 class="icon settings"> 󰒓 </h4>
    </Tooltipable>
    <Tooltipable text="Copy Recipe URL (Ctrl-Shift-L)" icon="Info">
        <h4 class="icon code" on:click={exportURL} on:keydown={exportURL}> <div class="r2">󰮓</div> </h4>
    </Tooltipable>
    <Tooltipable text="Clear All Modules (Ctrl-Shift-D)" icon="Info">
        <h4 class="icon clear" on:click={clearModules} on:keydown={clearModules}> <div class="r1"></div> </h4>
    </Tooltipable>
    <Tooltipable text="Module Quick Finder (Ctrl-Shift-P)" icon="Info">
        <h4 class="icon search" on:click={openSearchMenu}> <div class="l1"></div> </h4>
    </Tooltipable>
    <Tooltipable text="Toggle Custom JS Output (janky for me but YMMV)" icon="Info">
        <h4 class="icon code" on:click={changeJs} on:keydown={changeJs}> <div class="l1">󰘦</div> </h4>
    </Tooltipable>
</div>

<style>
    .toolbar {
        width: 100%;
        height: 100%;
    }
    .icon {
        width: 100%;
        padding: 8px 4px 8px 0;
        margin-top: 4px;
        border-radius: 4px;
        transform: translateX(-2px);
        background-color: #FFFFFF88;
        font-size: 24px;
        text-align: center;
        transition: 0.2s background-color;
    }
    .icon:hover {
        background-color: #00000033;
    }
    .r1 { transform: translateX(1px) }
    .r2 { transform: translateX(2px) }
    /* .r3 { transform: translateX(3px) } */
    /* .r4 { transform: translateX(4px) } */
    /* .r5 { transform: translateX(5px) } */
    /* .r6 { transform: translateX(6px) } */
    .l1 { transform: translateX(-1px) }
    .l2 { transform: translateX(-2px) }
    /* .l3 { transform: translateX(-3px) } */
    /* .l4 { transform: translateX(-4px) } */
    /* .l5 { transform: translateX(-5px) } */
    /* .l6 { transform: translateX(-6px) } */
    /* .right * {
        transform: translateX(2px);
    }
    span {
        display: block;
    }
    a {
        color: black;
        text-decoration: none;
    } */
    h4 {
        cursor: pointer;
        user-select: none;
    }
</style>
