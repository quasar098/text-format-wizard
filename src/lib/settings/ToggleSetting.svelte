<script lang="ts">
    import { getSetting, setSetting } from "../ts/settings.ts";

    export let name: string;

    if (name === undefined) {
        throw new Error("name for togglesetting undefined");
    }

    let active: boolean = getSetting(name);

    $: {
        setSetting(name, active);
    }
</script>

<div class='switch {active ? 'active' : 'inactive'}' on:click={() => {active = !active}}>
    <div class='dot'>

    </div>
</div>

<style>
    .switch {
        width: 60px;
        height: 30px;
        display: inline-flex;
        align-items: center;
        border-radius: 1000px;
        border: 2px solid white;
        margin: 0;
        transition-duration: 0.2s;
        transition-property: background-color;
        cursor: pointer;
        box-shadow: inset 0px 0px 0.4rem rgba(0, 0, 0, 0.3), 0px 0px 1rem rgba(250, 255, 255, 0.12);
        user-select: none;
    }
    .switch.inactive {
        background-color: #d72638;
    }
    .switch.active {
        background-color: #59c9a5;
    }
    .switch.active .dot {
        transform: translateX(28px);
    }
    .dot {
        margin-left: 5px;
        margin-right: 5px;
        width: 22px;
        height: 22px;
        border-radius: 100px;
        background-color: white;
        box-shadow: inset 0px 0px 0.4rem rgba(0, 0, 0, 0.14), 0px 0px 0.2rem rgba(0, 0, 0, 0.2);
        transition-duration: 0.3s;
        transition-property: transform;
        transition-timing-function: cubic-bezier(0.21, 0.63, 0.36, 1);
    }
</style>
