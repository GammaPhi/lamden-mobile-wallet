<script>
import Container from '../components/Core/Container.svelte';
import { loggedInEvent, loggedIn, storedWallet, networkInfo, selectedNetwork } from '../stores/globalStore'
import LoginPage from './LoginPage.svelte';
import { shortenAddress } from '../utils/utils';
import Button from '../components/Core/Button.svelte';
import { lockWallet } from '../utils/wallet-seed'
import { onMount } from 'svelte';
import { parseParams } from '../utils/utils'
import { sendTransaction, sendTransactionResponse } from '../utils/walletProvider/lamdenProvider'
import { writable } from 'svelte/store';

let errors = writable([]);

const logout = () => {
    lockWallet();
}

loggedInEvent.on('loggedIn', () => {
    const params = parseParams(window.location.search);
    console.log(params);
    if (params.origin && params.type && params.type==='login') {
        sendTransactionResponse(
            {"vk": $storedWallet.vk, "type": "vk"},
            params.origin
        )
    }

    if (
        params.contractName
        && params.methodName
        && params.kwargs
        && params.stampLimit
        && params.origin
        && params.type
        && params.type ==='sign'
    ) {
        let network = params.network || $selectedNetwork;
        selectedNetwork.set(network);

        const callback = (response, tx) => {
            console.log(response);
            console.log(tx);
            history.pushState({}, '', '/');
            sendTransactionResponse(
                tx,
                params.origin
            );
            if (tx.resultInfo.type === 'error') {
                errors.set(tx.resultInfo.errorInfo);
                return;
            }           
            // if not error
            window.close();
        };

        setTimeout(() =>{
            sendTransaction(
                params.contractName,
                params.methodName,
                JSON.parse(params.kwargs),
                parseInt(params.stampLimit, 10),
                callback
            );
        }, 50);
    }
    console.log('Logged in!');
});

</script>

<Container>
    {#if $loggedIn}
        Logged in with 
        <a 
            href="{$networkInfo.addressExplorer}/{$storedWallet.vk}"
            target="_blank"
        >
        {shortenAddress($storedWallet.vk)}
        </a>
        <br />
        {#each $errors as error}
        <p class="bold red">
            {error}
        </p>
        {/each}
        <Button 
            onClick={logout}
        >
            Log out
        </Button>       
    {:else}
        <LoginPage />
    {/if}
</Container>
