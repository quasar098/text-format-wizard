<script lang="ts">
    import VisibilityChange from "svelte-visibility-change";
    import { tooltipStack } from "./ts/stores";
    import cssVars from "svelte-css-vars";
    import { TooltipIcon } from "./ts/tooltip";

    $: theStack = $tooltipStack;

    $: tooltip = theStack[theStack.length-1] ?? { text: "", icon: TooltipIcon[TooltipIcon.None], uuid: "placeholder here" };

    $: styleVars = {
        "icon-color": TooltipIcon[tooltip.icon].color ?? "#000000"
    };

    function removeAllTooltips() {
        tooltipStack.update(_ => []);
    }

</script>

<VisibilityChange on:change={removeAllTooltips}/>

<div class="outer" use:cssVars={styleVars}>
    <div class="inner">
        {#key tooltip.text}
            <p class="icon text-glow">
                {TooltipIcon[tooltip.icon].text}
            </p>
            <p class="tooltip text-glow text">
                {tooltip.text}
            </p>
        {/key}
    </div>
</div>

<style>
    .outer {
        height: 30px;
        margin-left: 10px;
        margin-right: 10px;
        background-color: var(--FRAME-COLOR);
        border-radius: 4px;
        box-shadow: inset 0 0 0.6em rgba(0, 0, 0, 0.23);
    }
    .inner {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        gap: 15px;
        align-items: center;
        width: 100%;
        height: 100%;
        margin-left: 10px;
    }
    .tooltip {
        font-style: italic;
        font-size: 16px;
    }
    .icon {
        color: var(--icon-color);
        font-size: 24px;
    }
</style>
