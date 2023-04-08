<script lang="ts">
    import { get } from "svelte/store";
    import Frame from "./Frame.svelte";
    import { moduleMap, moduleMetadata } from './ts/master';
    import { recipeModules, addModuleModalInfo, showAddModuleModal } from "./ts/stores";
    import { fadeBgIn, fadeBgOut, discordIn, discordOut } from "./ts/transitions";

    function hideModal() {
        addModuleInfo = {};
        $addModuleModalInfo = undefined;
        $showAddModuleModal = false;
    }

    $: info = [$addModuleModalInfo ?? {}][0];

    $: metadata = moduleMetadata[info.moduleType];

    let addModuleInfo = {};

    function keyDownHandler(e) {
        if (e.keyCode == 27) {
            hideModal();
            document.activeElement.blur();
        }

        if ($showAddModuleModal) {
            console.log(showAddModuleModal);
            if (e.keyCode == 13) {
                addModule();
            }
        }

        if (e.keyCode == 80 && e.shiftKey && e.ctrlKey) {
            $addModuleModalInfo = undefined;
            $showAddModuleModal = false;
        }
    }

    function addModule() {
        recipeModules.update((old) => {
            old.push({moduleType: info.moduleType, args: {...addModuleInfo}});
            return old;
        })
        $addModuleModalInfo = undefined;
        $showAddModuleModal = false;
        addModuleInfo = {};
        setTimeout(() => {
            addModuleInfo = {};
        }, 40);
    }
</script>

<svelte:body on:keydown={keyDownHandler}/>

{#if $showAddModuleModal}
    <div class="outer-modal" in:fadeBgIn out:fadeBgOut>
        <div class="modal">
            <Frame title='Add "{info.moduleName}" module' onclose={hideModal}
                enterTransition={discordIn} exitTransition={discordOut}>

                <p class="description">> {metadata.description}</p>

                <svelte:component this={moduleMap[info.moduleType]}
                    bind:info={addModuleInfo}></svelte:component>

                <button class="add-module" tabindex="0" on:click={addModule}>Add</button>

            </Frame>
        </div>
    </div>
{/if}

<style>
    .outer-modal {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        z-index: 100;
        background-color: #00000044;
    }
    .add-module {
        margin-top: 30px;
        border: solid 1px var(--BG-COLOR);
        display: block;
        transition: 0.2s background-color;
        cursor: pointer;
    }
    .add-module:focus-visible {
        background-color: var(--FOCUSED);
        outline: none;
    }
    .add-module:active {
        filter: brightness(0.7);
    }
    .modal {
        width: calc(100% - 150px);
        height: calc(100% - 150px);
        margin-left: 75px;
        margin-top: 75px;
    }
    .description {
        font-style: italic;
        margin-bottom: 30px;
    }
</style>
