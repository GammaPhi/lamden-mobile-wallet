<script>
import { writable } from "svelte/store";


    export let onClick, timeout=10;

    const clicked = writable(false);

    const realOnClick = async () => {
        clicked.set(true);
        await onClick();
        if (timeout > 0) {
            setTimeout(()=>{
                clicked.set(false);
            }, timeout)
        }
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

<span>
{#if $clicked}
<i on:click={()=>{}} class="fas fa-sync fa-spin"></i>
{:else}
<i on:click={(realOnClick)} class="fas fa-sync"></i>
{/if}
</span>