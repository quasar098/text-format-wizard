<script lang="ts">
    import AppendModule from "./modules/AppendModule.svelte";
    import ReplaceModule from "./modules/ReplaceModule.svelte";
    import RemoveModule from "./modules/RemoveModule.svelte";
    import InsertModule from "./modules/InsertModule.svelte";

    import { ModuleType, moduleMetadata } from "./ts/types";

    import { recipeModules } from "./ts/stores";

    export let moduleObject;

    let metadata = moduleMetadata[moduleObject.moduleType];

    const moduleMap = {
        [ModuleType.Append]: AppendModule,
        [ModuleType.Replace]: ReplaceModule,
        [ModuleType.Remove]: RemoveModule,
        [ModuleType.Insert]: InsertModule
    };

    function removeMe() {
        recipeModules.update((old) => {
            return old.filter(_ => _ != moduleObject);
        });
    }
</script>

<div class="module-preview">
    <div class="small add-button" on:click={removeMe} on:keydown={removeMe}>
        <p class="ekkxs">
            
        </p>
    </div>
    <div class="big">
        <div class="module-title" style="background-color: #{metadata.color}">
            <h3>{metadata.name}</h3>
        </div>
        <div class="module-description" style="background-color: #{metadata.color}99">
            <svelte:component this={moduleMap[moduleObject.moduleType]}
            bind:info={moduleObject.args} redo={() => setTimeout(() => {recipeModules.update(_ => _)}, 10)}/>
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
    p.ekkxs {
        font-size: 18px;
    }
    .module-preview {
        display: flex;
        justify-content: center;
        align-items: stretch;
        margin-bottom: 5px;
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
    .small:hover {
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
