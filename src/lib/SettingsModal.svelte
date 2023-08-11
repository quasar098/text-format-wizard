<script lang="ts">
    import { get } from "svelte/store";
    import Frame from "./Frame.svelte";
    import { getOpenModal, closeAllModals, openModal, modalStackInstanceId } from './ts/modal.ts';
    import { fadeBgIn, fadeBgOut, discordIn, discordOut } from "./ts/transitions.ts";

    import { getSetting, setSetting } from './ts/settings.ts';

    import ToggleSetting from "./settings/ToggleSetting.svelte";

    function keyDownHandler(e) {
        if (e.keyCode == 27) {
            closeAllModals();
            document.activeElement.blur();
        }
        if (e.keyCode == 48 && e.shiftKey && e.altKey) {
            closeAllModals();
            openModal(3);
            e.preventDefault(true);
        }
    }
</script>

<svelte:body on:keydown={keyDownHandler}/>

{#key $modalStackInstanceId}
    {#if getOpenModal(3)}
        <div class="outer-modal" in:fadeBgIn out:fadeBgOut>
            <div class="modal">
                <Frame title='> Settings' onclose={closeAllModals}
                    enterTransition={discordIn} exitTransition={discordOut}>

                    <div class="coming-soon">
                        <p class="text text-glow">Coming soon!</p>
                    </div>

                </Frame>
            </div>
        </div>
    {/if}
{/key}

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
    .coming-soon {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .modal {
        width: calc(100% - 150px);
        height: calc(100% - 150px);
        margin-left: 75px;
        margin-top: 75px;
    }
</style>
