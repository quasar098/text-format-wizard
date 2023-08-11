<script lang="ts">
    import { TooltipIcon, filterTooltipStack, pushTooltip } from "./ts/tooltip";
    export let text: string;
    export let icon: string;

    function stopTooltip() {
        filterTooltipStack(_ => _.uuid != tooltipId)
    }

    let tooltipId = crypto.randomUUID();

    function startTooltip() {
        pushTooltip({text, icon, uuid: tooltipId})
    }
</script>

<span on:mouseenter={startTooltip} on:mouseleave={stopTooltip}>
    <slot/>
</span>
