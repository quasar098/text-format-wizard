<script lang="ts">
    import { get } from "svelte/store";
    import Frame from "./Frame.svelte";
    import { getOpenModal, closeAllModals, openModal, modalStackInstanceId } from './ts/modal.ts';
    import { fadeBgIn, fadeBgOut, discordIn, discordOut } from "./ts/transitions.ts";

    import { getSetting, setSetting, Setting, checkKeybind } from './ts/settings.ts';

    import ToggleSetting from "./settings/ToggleSetting.svelte";
    import KeybindSetting from "./settings/KeybindSetting.svelte";
    import SettingsSection from "./settings/SettingsSection.svelte";

    function keyDownHandler(e) {
        if (getOpenModal(3)) {
            if (e.keyCode == 27) {
                closeAllModals();
                document.activeElement.blur();
            }
            if (checkKeybind(e, Setting.SettingsKeybind)) {
                e.preventDefault(true);
            }
        } else {
            if (checkKeybind(e, Setting.SettingsKeybind)) {
                closeAllModals();
                openModal(3);
                e.preventDefault(true);
            }
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

                    <SettingsSection title="General">
                        <div class='row'>
                            <p class="text">Show warning when trying to close the tab with modules in the recipe</p>
                            <ToggleSetting name={Setting.ShowLeaveWarning}/>
                        </div>
                        <div class='row'>
                            <p class="text">Bundle input text on recipe url copy</p>
                            <ToggleSetting name={Setting.IncludeInputOnCopyRecipeUrl}/>
                        </div>
                    </SettingsSection>

                    <SettingsSection title="Keybindings">
                        <div class='row'>
                            <p class="text">Module Quick Finder</p>
                            <KeybindSetting name={Setting.ModuleQuickFinderKeybind}/>
                        </div>
                        <div class='row'>
                            <p class="text">Settings</p>
                            <KeybindSetting name={Setting.SettingsKeybind}/>
                        </div>
                        <div class='row'>
                            <p class="text">Calculator</p>
                            <KeybindSetting name={Setting.CalculatorKeybind}/>
                        </div>
                        <div class='row'>
                            <p class="text">Copy Recipe URL</p>
                            <KeybindSetting name={Setting.CopyRecipeURLKeybind}/>
                        </div>
                        <div class='row'>
                            <p class="text">Clear All Modules</p>
                            <KeybindSetting name={Setting.ClearAllModulesKeybind}/>
                        </div>
                    </SettingsSection>

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
    .row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        padding-bottom: 10px;
    }
    .row:not(:last-of-type) {
        border-bottom: 1px solid #88888822;
    }
    .modal {
        width: calc(100% - 150px);
        height: calc(100% - 150px);
        margin-left: 75px;
        margin-top: 75px;
    }
    p.text {
        display: inline-block;
        margin: 0;
    }
</style>
