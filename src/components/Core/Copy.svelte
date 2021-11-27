<script>
import { writable } from "svelte/store";


    export let text;

    const clicked = writable(false);

    const onClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        navigator.clipboard.writeText(text);
        clicked.set(true);
        setTimeout(() => {
            clicked.set(false);
        }, 5000);
    }
</script>

<style>
    i {
        cursor: pointer;
    }

    i:hover {
        color: var(--accent-color)
    }
</style>

{#if $clicked}
<i on:click={onClick} class="fas fa-check"></i>
{:else}
<i on:click={onClick} class="fas fa-copy"></i>
{/if}