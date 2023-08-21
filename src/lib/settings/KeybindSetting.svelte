<script lang="ts">
    import { getSetting, setSetting } from "../ts/settings.ts";

    export let name: string;

    if (name === undefined) {
        throw new Error("name for keybindsetting undefined");
    }

    let ctrl: boolean = getSetting(name).ctrl;
    let alt: boolean = getSetting(name).alt;
    let shift: boolean = getSetting(name).shift;

    let code: string | undefined = getSetting(name).code;

    let currentlySettingKeybind: boolean = false;

    $: {
        setSetting(name, {
            ctrl: ctrl,
            shift: shift,
            alt: alt,
            code: code
        });
    }

    function keyDownHandler(e) {
        if (currentlySettingKeybind && e.keyCode == 32) {
            currentlySettingKeybind = false;
            return;
        }
        if (currentlySettingKeybind) {
            if (/Key\w|Digit\d/.test(e.code)) {
                code = e.code;
                currentlySettingKeybind = false;
            }
        }
    }

</script>

<svelte:body on:keydown={keyDownHandler}/>

<div class='outer'>
    {#if currentlySettingKeybind}
        <p class="text msg">(Setting keybind, press SPACE to cancel)</p>
    {/if}
    <div class='switch {ctrl ? 'active' : 'inactive'}' on:click={() => {ctrl = !ctrl}}>
        <div class='overlay-text text'>
            ctrl
        </div>
    </div>
    <div class='switch {shift ? 'active' : 'inactive'}' on:click={() => {shift = !shift}}>
        <div class='overlay-text text'>
            shift
        </div>
    </div>
    <div class='switch {alt ? 'active' : 'inactive'}' on:click={() => {alt = !alt}}>
        <div class='overlay-text text'>
            alt
        </div>
    </div>
    <div class='key switch' on:click={() => {currentlySettingKeybind = true}}>
        <div class='overlay-text text'>
            {code}
        </div>
    </div>
</div>

<style>
    .outer {
        display: flex;
        flex-direction: row;
        gap: 10px;
        align-items: center;
        user-select: none;
    }
    .msg {
        display: inline-block;
        height: 100%;
        line-height: 100%;
    }
    .switch.key {
        background-color: var(--BG-COLOR);
        width: 100px;
    }
    .key .overlay-text {
        width: 100px;
        text-align: center;
    }
    .overlay-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateY(-50%) translateX(-50%);
        z-index: 0;
        transition-duration: 0.3s;
    }
    .switch {
        width: 60px;
        height: 30px;
        display: inline-flex;
        position: relative;
        align-items: center;
        border-radius: 1000px;
        border: 2px solid white;
        margin: 0;
        transition-duration: 0.2s;
        transition-property: background-color;
        cursor: pointer;
        box-shadow: inset 0px 0px 0.4rem rgba(0, 0, 0, 0.3), 0px 0px 1rem rgba(250, 255, 255, 0.12);
        user-select: none;
    }
    .switch.inactive {
        background-color: #d72638;
    }
    .switch.active {
        background-color: #59c9a5;
    }
</style>
