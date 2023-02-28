<script lang="ts">
    export let title: string = undefined;
    export let width: number = 100;
    export let placeholder: string = "This frame is empty";
    let displayType: string = "block";
    if (width != 100) {
        displayType = "inline-block";
    }
</script>

<div class="outer-frame" style="
        width: calc({width}% - 10px - {width/10}px);
        display: {displayType}
    ">
    {#if title != undefined}
        <div class="title-sect">
            <h2>{title}</h2>
        </div>
    {/if}
    <div class='frame'>
        {#if $$slots.default}
            <slot></slot>
        {:else}
            <p>{placeholder}</p>
        {/if}
    </div>
</div>

<style>
    p, h2 { margin: 0 }
    .title-sect {
        border-radius: 4px;
        border-bottom-left-radius: 0px;
        border-bottom-right-radius: 0px;
        background-color: var(--ACCENT);
        padding: 5px;
        padding-top: 13px;
        width: calc(100% - 10px);
        padding-bottom: 6px;
        user-select: none;
        overflow-x: hidden;
    }
    h2 {
        font-size: 24px;
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
