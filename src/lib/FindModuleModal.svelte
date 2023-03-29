<script lang="ts">
    import { get } from "svelte/store";
    import Frame from "./Frame.svelte";
    import { ModuleType, moduleMetadata } from './ts/master';
    import { sortedModuleTypes } from "./ts/master";
    import { showFindModuleModal, addModuleModalInfo, showAddModuleModal } from './ts/stores';
    import { fadeBgIn, fadeBgOut, discordIn, discordOut } from "./ts/transitions";
    import { Svroller } from "svrollbar";
    import ModuleSelect from "./ModuleSelect.svelte";

    import Fuse from 'fuse.js';

    function keydownHandle(e) {
        if (e.keyCode == 27) {
            modalClosed();
        }
        if (e.keyCode != 80) {
            return;
        }
        if (!e.ctrlKey) {
            return;
        }
        event.preventDefault(true);
        if (!e.shiftKey) {
            return;
        }
        $showFindModuleModal = true;
    }

    const fuseOptions = {
        // isCaseSensitive: false,
        // includeScore: false,
        // shouldSort: true,
        // includeMatches: false,
        // findAllMatches: false,
        // minMatchCharLength: 1,
        // location: 0,
        // threshold: 0.6,
        // distance: 100,
        // useExtendedSearch: false,
        // ignoreLocation: false,
        // ignoreFieldNorm: false,
        // fieldNormWeight: 1,
        keys: [
            "metadata.name",
            "metadata.lore",
            "metadata.keywords"
        ]
    };

    function betterSorted() {
        let sortedTypes = sortedModuleTypes();
        let entries = [];
        for (let moduleType of sortedTypes) {
            let mMetadata = moduleMetadata[moduleType];
            entries.push({id: moduleType, metadata: mMetadata});
        }

        let fuse = new Fuse(entries, fuseOptions);

        let found = fuse.search(searchTerm);

        return found.map(_ => _.item.id);
    }

    $: searchTerm = "";

    function modalClosed() {
        $showFindModuleModal = false;
        searchTerm = "";
    }

    function inputKeyDown(e) {
        let betterSortedItems = betterSorted();
        if (e.keyCode == 13) {
            if (betterSortedItems.length) {
                modalClosed();
                $addModuleModalInfo = {moduleType: betterSortedItems[0], moduleName: moduleMetadata[betterSortedItems[0]].name}
                $showAddModuleModal = true;
            }
        }
    }

</script>

<svelte:body on:keydown={keydownHandle}/>

{#if $showFindModuleModal}
    <div class="outer-modal" in:fadeBgIn out:fadeBgOut>
        <div class="modal">
            <Frame title='Find module' enterTransition={discordIn} exitTransition={discordOut} onclose={modalClosed}>

                <div class='container'>
                    <input type="text" name="tfw-find-module" class="search" spellcheck="false" placeholder="Search for a module..."
                        autofocus="true" bind:value={searchTerm} on:keydown={inputKeyDown}/>

                    <Svroller width="100%" height="calc(100% - 30px)" alwaysVisible="true">
                        {#key searchTerm}
                            {#each betterSorted() as value, index}
                                <ModuleSelect type={value} onclick={modalClosed}/>
                            {:else}
                                {#if searchTerm.length}
                                    <p class="nomod">No modules found :(</p>
                                {:else}
                                    <p class="nomod">Type to search for modules</p>
                                    <div class='powered-by'>
                                        <p>
                                            Fuzzy search powered by Fuse.js
                                            <a href="https://fusejs.io/" target="_blank" rel="noreferrer">
                                                <img class="fuse" src="https://fusejs.io/assets/img/logo.png" alt="logo here"/>
                                            </a>
                                        </p>
                                    </div>
                                {/if}
                            {/each}
                        {/key}
                    </Svroller>
                </div>

            </Frame>
        </div>
    </div>
{/if}

<style>
    .fuse {
        height: 30px;
        transform: translateY(8px);
        cursor: pointer;
    }
    .fuse:hover {
        animation: spin 0.5s ease-in-out 1;
    }
    @keyframes spin {
        50% {
            transform: translateY(8px) rotate(180deg) scale(1.2)
        }

        to {
            transform: translateY(8px) rotate(180deg) scale(1)
        }
    }
    .outer-modal {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        z-index: 100;
        background-color: #00000044;
    }
    .powered-by {
        position: absolute;
        bottom: 13px;
        left: 13px;
    }
    .nomod {
        margin-left: 13px;
        margin-top: 3px;
    }
    .container {
        height: 100%;
        width: 100%;
        overflow-y: hidden;
    }
    .modal {
        width: calc(100% - 150px);
        height: calc(100% - 150px);
        margin-left: 75px;
        margin-top: 75px;
    }

    .search {
        border-radius: 4px;
        padding: 10px;
        outline: none;
        margin: 10px;
        width: calc(100% - 45px);
        transition: 0.2s;
        background-color: white;
        color: black;
        border: 1px solid black;
    }
    .search:focus {
        border: 1px solid var(--FOCUSED);
    }
</style>
