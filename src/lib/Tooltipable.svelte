<script lang="ts">
    import { TooltipIcon } from "./ts/tooltip";
    import { tooltipStack } from "./ts/stores";
    export let text: string;
    export let icon: string;

    function stopTooltip() {
        tooltipStack.update((stack) => {
            return stack.filter(_ => _.uuid != tooltipId)
        })
    }

    function startTooltip() {
        tooltipStack.update((stack) => {
            stack.push({text, icon, uuid: tooltipId});
            return stack;
        })
    }

    let tooltipId = crypto.randomUUID();
</script>

<span on:mouseenter={startTooltip} on:mouseleave={stopTooltip}>
    <slot/>
</span>
