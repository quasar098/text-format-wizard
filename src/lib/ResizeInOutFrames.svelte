
<script lang="ts">
    export let xposition;
    import cssVars from 'svelte-css-vars';
    import { clamp } from "./ts/master"

    $: styleVars = {
        left: `calc(${xposition}px - 10px)`
    }

    let grabbing = false;
    let oldWidth = Math.floor(window.innerWidth);

    function startGrab() {
        grabbing = true;
        oldWidth = Math.floor(window.innerWidth);
    }

    function stopGrab() {
        grabbing = false;
    }

    function updatePosition(e) {
        if (grabbing) {
            xposition = clamp(e.clientX, 30, Math.floor(window.innerWidth/20*19)-30);
        }
    }

    function onresize() {
        xposition = Math.floor(window.innerWidth)*xposition/oldWidth;
        oldWidth = Math.floor(window.innerWidth);
    }

</script>

<svelte:window on:mouseup={stopGrab} on:mousemove={updatePosition} on:resize={onresize}/>
<svelte:body on:mouseleave={stopGrab}/>

<div class="resize-bar" use:cssVars={styleVars} on:mousedown={startGrab} draggable="false">
</div>

<style>
    .resize-bar {
        display: inline-block;
        height: calc(45%);
        float: left;
        user-select: none;

        position: absolute;
        left: var(--left);
        cursor: col-resize;
        width: 20px;
        z-index: 10;
    }
</style>
