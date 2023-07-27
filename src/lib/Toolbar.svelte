<script lang="ts">
    import { outputAsJs, recipeModules, showFindModuleModal } from './ts/stores';
    import Tooltipable from './Tooltipable.svelte';

    function changeJs() {
        outputAsJs.update(_ => !_);
        recipeModules.update(_ => _);
    }

    function clearModules() {
        // todo: change from confirm to custom component
        if (confirm("Are you sure you want to do this?")) {
            recipeModules.set([]);
        }
    }

    function openSearchMenu() {
        $showFindModuleModal = true;
    }

    let currentTheme = 0;
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
        currentTheme = (currentTheme+1) % themes.length;
        applyCurrentTheme();
    }

    function applyCurrentTheme() {
        for (let property of Object.keys(themes[currentTheme].properties)) {
            document.body.style.setProperty(property, themes[currentTheme].properties[property]);
        }
        document.body.setAttribute("theme", themes[currentTheme].name);
    }

    applyCurrentTheme();
</script>

<div class="toolbar">
    <!-- todo: implement settings -->
    <Tooltipable text="Switch Themes" icon="Info">
        <h4 class="icon code" on:click={changeTheme} on:keydown={changeTheme}> 󰃝 </h4>
    </Tooltipable>
    <Tooltipable text="Settings (not implemented yet)" icon="Info">
        <h4 class="icon settings"> 󰒓 </h4>
    </Tooltipable>
    <Tooltipable text="Clear All Modules" icon="Info">
        <h4 class="icon clear" on:click={clearModules} on:keydown={clearModules}>  </h4>
    </Tooltipable>
    <Tooltipable text="Module Quick Finder (Ctrl-Shift-P)" icon="Info">
        <h4 class="icon search" on:click={openSearchMenu}>  </h4>
    </Tooltipable>
    <Tooltipable text="Toggle Custom JS Output (may or may not work yet)" icon="Info">
        <h4 class="icon code" on:click={changeJs} on:keydown={changeJs}>  </h4>
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
