<script>
import Link from '../Core/Link.svelte';
import { selectedNetwork, networkChangedEvent } from '../../stores/globalStore';

const onClick = () => {
    let networkName = ($selectedNetwork === 'mainnet') ? "Testnet" : "Mainnet";
    if (confirm("Are you sure you want to switch to the Lamden "+networkName+"?")) {
        if ($selectedNetwork === 'mainnet') {
            selectedNetwork.set("testnet");
        } else {
            selectedNetwork.set("mainnet");
        }
        networkChangedEvent.emit("networkChanged");
    }
}

</script>

<Link
    onClick={onClick}
>
{#if $selectedNetwork === 'mainnet'}
Lamden Mainnet
{:else}
Lamden Testnet
{/if}
</Link>