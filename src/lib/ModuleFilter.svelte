<script lang="ts">
    import { moduleFrameFilter } from "./ts/stores.ts";
    import { moduleColor } from "./ts/module.ts";
    import Tooltipable from "./Tooltipable.svelte";
    import cssVars from 'svelte-css-vars';

    function setModuleFrameFilter(categoryName) {
        let categoryColor = moduleColor[categoryName];
        if ($moduleFrameFilter == categoryColor) {
            $moduleFrameFilter = "";
        } else {
            $moduleFrameFilter = categoryColor;
        }
    }

    let deactivatedBg = '#828489';

    $: mfilterCss = {
        'generic-bg': moduleColor.generic.includes($moduleFrameFilter) ? '#fbb761' : deactivatedBg,
        'logic-bg': moduleColor.logic.includes($moduleFrameFilter) ? '#f9cb40' : deactivatedBg,
        'ctf-bg': moduleColor.ctf.includes($moduleFrameFilter) ? '#ead637' : deactivatedBg,
        'misc-bg': moduleColor.misc.includes($moduleFrameFilter) ? '#208f40' : deactivatedBg,
        'encoding-bg': moduleColor.encoding.includes($moduleFrameFilter) ? '#87abf0' : deactivatedBg
    }
</script>

<Tooltipable text="Filter by category (e.g. generic, encoding, ctf)" icon="Info">
    <div class="modules-frame-filters">

        <div class='mfilter mfilter-generic' use:cssVars="{mfilterCss}" on:click={() => setModuleFrameFilter('generic')}>
            <p class="mfilter-icon" style="transform: translateX(-4px)">󱍓</p>
        </div>
        <div class='mfilter mfilter-logic' use:cssVars="{mfilterCss}" on:click={() => setModuleFrameFilter('logic')}>
            <p class="mfilter-icon" style="transform: translateX(-6px)"></p>
        </div>
        <div class='mfilter mfilter-ctf' use:cssVars="{mfilterCss}" on:click={() => setModuleFrameFilter('ctf')}>
            <p class="mfilter-icon" style="transform: translateX(-4px)"></p>
        </div>
        <div class='mfilter mfilter-misc' use:cssVars="{mfilterCss}" on:click={() => setModuleFrameFilter('misc')}>
            <p class="mfilter-icon" style="transform: translateX(-3px)">󱌣</p>
        </div>
        <div class='mfilter mfilter-encoding' use:cssVars="{mfilterCss}" on:click={() => setModuleFrameFilter('encoding')}>
            <p class="mfilter-icon" style="transform: translateX(-2px)">󰣧</p>
        </div>
    </div>
</Tooltipable>

<style>
    .modules-frame-filters {
        box-shadow: inset 0px 0px 0.6rem rgba(0, 0, 0, 0.2);
        background-color: #00000011;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        gap: 5px;
        height: calc(100% - 73px);
        align-items: center;
        width: 55px;
        position: absolute;
        padding-bottom: 5px;
        padding-top: 5px;
        top: 53px;
        left: 7px;
    }
    .mfilter {
        width: 45px;
        height: 100%;
        margin: 0px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
        box-shadow: inset 0px 0px 0.6rem rgba(0, 0, 0, 0.3);
        user-select: none;
        cursor: pointer;
        transition-duration: 0.1s;
        transition-property: background-color;
    }
    .mfilter:hover {
        background-color: var(--FOCUSED);
    }
    .mfilter-icon {
        font-size: 24px;
    }
    .mfilter-encoding {
        background-color: var(--encoding-bg);
    }
    .mfilter-ctf {
        background-color: var(--ctf-bg);
    }
    .mfilter-generic {
        background-color: var(--generic-bg);
    }
    .mfilter-logic {
        background-color: var(--logic-bg);
    }
    .mfilter-misc {
        background-color: var(--misc-bg);
    }
</style>
