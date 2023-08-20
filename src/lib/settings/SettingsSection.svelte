<script lang="ts">
    export let title = "Untitled Settings Section";
</script>

<div class='outer'>
    <h3 class="text">{title}</h3>
    <div class='line'></div>
</div>
<div class='section'>
    <slot>
    </slot>
</div>

<style>
    .line {
        border-top: 2px solid #888888;
        margin-left: 10px;
        margin-right: 10px;
        margin-bottom: 20px;
        transform: translateY(-2px);
        width: 0%;
        transition-duration: 0.3s;
        transition-timing-function: cubic-bezier(.21,.72,.37,.83);
        transition-property: width;
    }
    .outer:hover .line {
        width: calc(100% - 20px);
    }
    h3 {
        margin: 20px 10px 0px 10px;
        padding-bottom: 3px;
        font-size: 36px;
        font-weight: normal;
        user-select: none;
        border-bottom: 2px solid #656565;
    }
    .section {
        margin-left: 10px;
        margin-right: 10px;
    }
</style>
