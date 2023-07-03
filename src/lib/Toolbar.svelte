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
</script>

<div class="toolbar">
    <!-- todo: implement settings -->
    <Tooltipable text="Settings (not implemented yet)" icon="Info">
        <h4 class="icon settings"> 󰒓 </h4>
    </Tooltipable>
    <Tooltipable text="Clear all Modules" icon="Info">
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
    .right * {
        transform: translateX(2px);
    }
    span {
        display: block;
    }
    h4 {
        cursor: pointer;
        user-select: none;
    }
    a {
        color: black;
        text-decoration: none;
    }
</style>
