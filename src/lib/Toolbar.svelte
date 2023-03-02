<script lang="ts">
    import { outputAsJs, recipeModules } from './ts/stores'

    function changeJs() {
        outputAsJs.update(_ => !_);
        recipeModules.update(_ => _);
    }
</script>

<div class="toolbar">
    <h4 class="icon settings">󰒓</h4>
    <h4 class="icon code" on:click={changeJs} on:keydown={changeJs}></h4>
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
    h4 {
        cursor: pointer;
        user-select: none;
    }
</style>
