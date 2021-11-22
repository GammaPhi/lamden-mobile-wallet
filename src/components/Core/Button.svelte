<script>
    export let onClick, color="primary", disabled=false;
</script>

<style>
    button {
        position: relative;
        color: white;
        background-color: #461bc2;
        margin-bottom: 1rem;
        border: none;
        border-radius: 0.4em;
        width: fit-content;
        font-family: inherit;
        font-size: 1em;
        font-weight: 500;
        -webkit-padding: 0.65em 0;
        padding: 0.8em 1.6em;
        margin-top: 1rem;
        box-sizing: border-box;
        cursor: pointer;
    }

    button:disabled {
        color: #999;
    }

    button:not(:disabled):hover {
        filter: brightness(130%);
    }

    button:not(:disabled):active {
        filter: brightness(110%);
        top: 2px;
    }

    button:focus {
        border-color: #666;
    }

    button.cancel {
        color: white;
        background-color: var(--color-gray-4);
    }
</style>

<button disabled={disabled} class={color} on:click={onClick}><slot></slot></button>