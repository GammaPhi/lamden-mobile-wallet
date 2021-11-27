<script>
import Container from '../components/Core/Container.svelte';
import { loggedInEvent, loggedIn, storedWallet, networkInfo } from '../stores/globalStore'
import LoginPage from './LoginPage.svelte';
import { shortenAddress } from '../utils/utils';
import Button from '../components/Core/Button.svelte';
import { lockWallet, forgetWallet, addOrUpdateConnection, isAutoApproved, extractBaseUrlFromOrigin } from '../utils/wallet-seed'
import { parseParams } from '../utils/utils'
import { sendTransaction, checkLamdenBalance, sendTransactionResponse } from '../utils/walletProvider/lamdenProvider'
import { writable, derived } from 'svelte/store';
import BN from 'bignumber.js'
import Copy from '../components/Core/Copy.svelte';
import Link from '../components/Core/Link.svelte';
import { page } from '../utils/navigation-utils'
import AccountsPage from './AccountsPage.svelte';
import ConnectionsPage from './ConnectionsPage.svelte';
import Balances from '../components/Balances.svelte';
import NetworkSelector from '../components/Forms/NetworkSelector.svelte'

let errors = writable([]);
const approvalDetails = writable(null);
let autoConfirm = writable(false);

const logout = () => {
    lockWallet();
}

const forget = () => {
    if (confirm("Are you sure?")) {
        forgetWallet();
    }
}

const approve = (updateConnection) => {
    let params = $approvalDetails;
    if (params.type === 'sign') {
        const callback = (response, tx) => {
            console.log(response);
            console.log(tx);
            history.pushState({}, '', '/');
            sendTransactionResponse(
                {
                    errors: tx.errors,
                    resultInfo: tx.resultInfo,
                    txBlockResult: tx.txBlockResult,
                    txSendResult: tx.txSendResult,
                    txCheckResult: tx.txCheckResult,
                    nonceResult: tx.nonceResult,
                    sortedPayload: tx.sortedPayload,
                    payload: tx.payload,
                    sender: tx.sender,
                    method: tx.method,
                    online: tx.online,
                    stampLimit: tx.stampLimit,
                    transactionSigned: tx.transactionSigned,
                    txCheckAttempts: tx.txCheckAttempts,
                    txCheckLimit: tx.txCheckLimit,
                    type: tx.type,
                    name: tx.name,
                    uid: params.uid
                },
                params.origin
            );
            if (tx.resultInfo.type === 'error') {
                errors.set(tx.resultInfo.errorInfo);
            }
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
    } else if (params.type === 'login') {
        if (updateConnection) {
            addOrUpdateConnection(params.origin, $autoConfirm);
        }
        sendTransactionResponse(
            {"vk": $storedWallet.vk, "type": "vk"},
            params.origin
        )
    }
    history.pushState({}, '', window.location.pathname);
    approvalDetails.set(null);
}

const reject = () => {
    sendTransactionResponse(
        {"status": "rejected"},
        $approvalDetails.origin
    )
    history.pushState({}, '', window.location.pathname);
    approvalDetails.set(null);
}

loggedInEvent.on('loggedIn', () => {
    const params = parseParams(window.location.search);

    if (params.origin && params.type && params.type==='login') {
        approvalDetails.set(params)

        if (isAutoApproved(params.origin)) {
            setTimeout(()=>{
                approve(false);
            }, 10);            
        }

        const eventHandler = (event) => {
            if (extractBaseUrlFromOrigin(event.origin) !== extractBaseUrlFromOrigin(params.origin))
                return;
            console.log("Received event from origin: "+event.origin);
            console.log(event.data);
            approvalDetails.set(event.data);
            if (isAutoApproved(params.origin)) {
                setTimeout(()=>{
                    approve(false);
                }, 10);            
            }
        };
        window.addEventListener("message", eventHandler, false);

    } else if (
        params.contractName
        && params.methodName
        && params.kwargs
        && params.stampLimit
        && params.origin
        && params.type
        && params.type ==='sign'
    ) {
        approvalDetails.set(params)
        if (isAutoApproved(params.origin)) {
            setTimeout(()=>{
                approve(false);
            }, 10);            
        }
    }

});

</script>

<style>
    div.spacing {
        margin-top: 100px;
    }
</style>

<div class="spacing">

</div>
<Container>
    {#if $loggedIn}                
        <NetworkSelector />
        <br /><br /><br />
        Logged in with 
        <a 
            href="{$networkInfo.addressExplorer}/{$storedWallet.vk}"
            target="_blank"
        >
        {shortenAddress($storedWallet.vk)}
        </a>
        <Copy text={$storedWallet.vk} />
        {#if $page === '/accounts'}
            <AccountsPage />
        {:else if $page === '/connections'}
            <ConnectionsPage />
        {:else if $page === '/balances'}
            <Balances />
        {:else if $page === '/'}
            {#if $approvalDetails !== null} 
                {#if $approvalDetails.type === 'login'}
                <p>Are you sure you want to login?</p>
                <p>
                    Auto-approve transactions from this site
                    <input 
                        type="checkbox"
                        checked={$autoConfirm}
                        on:change={(e) => autoConfirm.set(e.target.checked)}
                    />
                </p>
                {:else if $approvalDetails.type === 'sign'}
                <p>Are you sure you want to sign this transaction?</p>
                {/if}
                <Container>
                    <Button 
                        color="cancel"
                        onClick={reject}
                    >
                        Reject
                    </Button>   
                    <Button 
                        onClick={()=>approve(true)}
                    >
                        Approve
                    </Button>   
                </Container>
            {/if}
            <br /><br />
            {#each $errors as error}
            <p class="bold red">
                {error}
            </p>
            {/each}

            <br /><br />
            <Link 
                onClick={logout}
            >
                Logout
            </Link>
            <br /> <br />
            <Link 
                onClick={forget}
            >
                Forget Wallet
            </Link>

        {/if}     
    {:else}
        <LoginPage />
    {/if}
</Container>
<div class="spacing"></div>
<div class="spacing"></div>
<div class="spacing"></div>
<div class="spacing"></div>