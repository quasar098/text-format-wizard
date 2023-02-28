<script lang="ts">
    import Frame from "./Frame.svelte";
    import { ModuleType, moduleMetadata } from './ts/types';
    export let addModalInfo = undefined;

    function hideModal() {
        addModalInfo = undefined;
    }

    $: metadata = moduleMetadata[[addModalInfo ?? {}][0].moduleType];

    document.addEventListener("keydown", (e) => {
        if (e.keyCode == 27) {
            hideModal();
            document.activeElement.blur();
        }
    })
</script>

{#if addModalInfo}
    <div class="outer-modal">
        <div class="modal">
            <Frame title="Add module" color="#{metadata.color}"
                onclose={() => {addModalInfo = undefined}}>

            </Frame>
        </div>
    </div>
{/if}

<style>
    .outer-modal {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        z-index: 100;
        background-color: #00000044;
    }
    .modal {
        width: calc(100% - 150px);
        height: calc(100% - 150px);
        margin-left: 75px;
        margin-top: 75px;
    }
</style>
