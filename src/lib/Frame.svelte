<script lang="ts">
    export let title: string = undefined;
    export let color: string = undefined;
    export let width: number = 100;
    export let height: string = "100%";
    export let onclose = undefined;
    let displayType: string = "block";
    if (width != 100) {
        displayType = "inline-block";
    }
    if (color == undefined) {
        color = 'var(--ACCENT)';
    }
</script>

<div class="outer-frame" style="
        width: calc({width}% - 10px - {width/10}px);
        display: {displayType};
        height: calc({height} - 15px)
    ">
    {#if title != undefined}
        <div class="title-sect" style="background-color: {color}">
            <h2>{title}</h2>
            {#if onclose != undefined}
                <p class="close" on:click={onclose} on:keydown={ () => {} }></p>
            {/if}
        </div>
    {/if}
    <div class='frame' style="height: calc({height} - 63px)">
        <slot></slot>
    </div>
</div>

<style>
    p, h2 { margin: 0 }
    .title-sect {
        border-radius: 4px;
        border-bottom-left-radius: 0px;
        border-bottom-right-radius: 0px;
        padding: 5px;
        padding-top: 13px;
        width: calc(100% - 10px);
        padding-bottom: 6px;
        user-select: none;
        overflow-x: hidden;
    }
    h2 {
        font-size: 24px;
        display: inline-block;
    }
    .outer-frame {
        float: left;
        margin: 10px;
        margin-right: 0px;
        margin-bottom: 0px;
    }
    ::selection {
        color: white;
        background-color: var(--BG-COLOR);
    }
    .frame {
        background-color: var(--FRAME-COLOR);
        box-shadow: inset 0 0 0.6em rgba(0, 0, 0, 0.23);
        filter: contrast(0.8);
        border-bottom-right-radius: 4px;
        border-bottom-left-radius: 4px;
        padding: 5px;
        top: 0;
        left: 0;
        width: calc(100% - 10px);
        display: inline-block;
        overflow-y: auto;
    }
    .frame::-webkit-scrollbar {
        display: none;
    }
    .frame::-moz-scrollbar {
        display: none;
    }
    .close {
        font-size: 24px;
        float: right;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 5px;
        padding-right: 2px;
        padding-top: 1px;
        margin-right: 10px;
        width: 20px;
        height: 20px;
        cursor: pointer;
        border-radius: 4px;
    }
    .close:hover {
        background-color: #FFFFFF11;
    }
    .close:focus-visible {
        outline: none;
        background-color: #ffffff11;
    }
</style>

{#if title == undefined}
    <style>
        .frame {
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
        }
    </style>
{/if}
