<script lang="ts">
    import { recipeModules } from "./ts/stores";

    export let value = false;

    export let defaultValue = false;

    if (value == false && defaultValue != false) {
        setTimeout(() => {
            value = defaultValue;
        }, 2)
    }
</script>


<label class="container">
    <input type="checkbox" bind:checked={value} on:keydown={() => setTimeout(() => {recipeModules.update(_ => _)}, 20)}/>
    <span class="checkmark"></span>
</label>


<style>
    input {
        user-select: none;
        border-radius: 1px;
        height: 16px;
        width: 16px;
        background-color: #EEE;
        color: black;
        box-shadow: inset 0px 0px 0.4rem rgba(0, 0, 0, 0.2);
        outline: 1px solid black;
        -moz-appearance:none;
        -webkit-appearance:none;
        -o-appearance:none;
        margin: 0px;
        margin-top: 4px;
        margin-left: 3px;
    }
    input:hover {
        background-color: var(--FOCUSED);
    }
    input:checked {
        background-color: #00a8e8;
    }

    .container {
      position: relative;
    }

    /* Create the checkmark/indicator (hidden when not checked) */
    .checkmark:after {
      content: "";
      position: absolute;
      display: none;
    }

    /* Show the checkmark when checked */
    .container input:checked ~ .checkmark:after {
      display: block;
    }

    /* Style the checkmark/indicator */
    .container .checkmark:after {
      left: 9px;
      top: 5px;
      width: 3.5px;
      height: 7px;
      border: solid white;
      border-width: 0 2.5px 2.5px 0;
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: translate(0px, -3px) rotate(45deg);
    }
</style>
