<script lang="ts">
    export let value;
    export let options;

    let shown = false;

    function toggleShown() {
        shown = !shown;
    }

    function keydownHandler(e) {
        if (dropdownTitle == null) {
            return;
        }
        if (dropdownTitle.matches(":hover")) {
            if (options.indexOf(value) == -1) {
                return;
            }
            if (e.keyCode == 38) {
                value = options[(((options.indexOf(value)-1) % options.length) + options.length) % options.length]
            }
            if (e.keyCode == 40) {
                value = options[(((options.indexOf(value)+1) % options.length) + options.length) % options.length]
            }
            e.preventDefault(true);
            return false;
        }
    }

    let dropdownTitle;
</script>

<svelte:body on:keydown={keydownHandler}/>

<div class="outer-dropdown">
    <div class="dropdown-title" on:click={toggleShown} bind:this={dropdownTitle}>
        <p>{value}</p>
        <p class="caret-down"></p>
    </div>
    {#if shown}
        <div class="options">
            {#each options as option, i}
                <div class="dropdown-option" on:click={() => {value = option; toggleShown()}}>
                    <p>{option}</p>
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .outer-dropdown {
        border-radius: 4px;
        height: 32px;
        width: 200px;
        background-color: #EEE;
        color: black;
        box-shadow: inset 0px 0px 0.4rem rgba(0, 0, 0, 0.2);
        position: relative;
        cursor: pointer;
        user-select: none;
    }
    .dropdown-option {
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        z-index: 10;
    }
    .dropdown-title {
        width: calc(100% - 50px);
        margin: 0 25px 0 25px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        user-select: none;
    }
    .outer-dropdown:hover:not(:has(.dropdown-option:hover)) {
        background-color: var(--FOCUSED);
    }
    .caret-down {
        font-size: 24px;
    }
    .options {
        border-radius: 4px;
        position: absolute;
        background-color: #EEE;
        border-radius: 4px;
        box-shadow: inset 0px 0px 0.4rem rgba(0, 0, 0, 0.2);
    }
    .dropdown-option {
        width: 200px;
        height: 32px;
    }
    .dropdown-option:hover {
        background-color: var(--FOCUSED);
        box-shadow: inset 0px 0px 0.4rem rgba(0, 0, 0, 0.2);
    }
</style>
