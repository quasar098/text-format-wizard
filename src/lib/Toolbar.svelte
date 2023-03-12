<script lang="ts">
    import { outputAsJs, recipeModules, showFindModuleModal } from './ts/stores'

    function changeJs() {
        outputAsJs.update(_ => !_);
        recipeModules.update(_ => _);
    }

    function clearModules() {
        recipeModules.set([]);
    }

    function openSearchMenu() {
        $showFindModuleModal = true;
    }
</script>

<div class="toolbar">
    <h4 class="icon settings"> 󰒓 </h4>
    <h4 class="icon code" on:click={changeJs} on:keydown={changeJs}>  </h4>
    <h4 class="icon code" on:click={clearModules} on:keydown={clearModules}>  </h4>
    <a href="https://github.com/quasar098/text-format-wizard#demonstration" rel="noreferrer" target="_blank"><h4 class="icon code right">
         <span></span>
    </h4></a>
    <a href="https://quasar.name/"><h4 class="icon code">  </h4></a>
    <h4 class="icon code" on:click={openSearchMenu}>  </h4>
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
