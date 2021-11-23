
<script lang='ts'>
    export let link;
    export let href;  
    export let mobile = false      
    
    import { navigateLink, page } from '../../utils/navigation-utils'

</script>

{#if link !== "Explorer" && link !== "Wallet" }
    <a on:click={navigateLink} href="{href}" class="nav-link {$page===href ? "active" : ""}" class:mobile={mobile}>{link}</a>
{:else}
    <a href="{href}" target="_blank" rel="noopener noreferrer" class="nav-link" class:mobile={mobile}>{link}</a>
{/if}

<style>

    .nav-link {
        color: var(--color-gray-4);
        text-decoration: none;
        font-size: 16px; 
        font-weight: 800;
        border-bottom: 2px solid transparent;
        margin: 0 1em;
    }
    .nav-link:hover {
        color: var(--primary-color);
        border-bottom: 2px solid var(--primary-color);
    }

    .nav-link.active {
        color: var(--primary-color);
        border-bottom: 2px solid var(--primary-color);
    }

    a.mobile{
        color: var(--white-color);
    }
    a.mobile:hover{
        color: var(--accent-color);
        border-bottom: 2px solid var(--accent-color);
    }
    a.mobile:visited{
        color: var(--white-color);
    }

</style>

