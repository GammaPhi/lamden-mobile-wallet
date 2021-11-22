<script>
import Container from '../components/Core/Container.svelte';
import { loggedInEvent, loggedIn, storedWallet, networkInfo, selectedNetwork } from '../stores/globalStore'
import LoginPage from './LoginPage.svelte';
import { shortenAddress } from '../utils/utils';
import Button from '../components/Core/Button.svelte';
import { lockWallet } from '../utils/wallet-seed'
import { onMount } from 'svelte';
import { parseParams } from '../utils/utils'
import { sendTransaction, checkLamdenBalance, sendTransactionResponse } from '../utils/walletProvider/lamdenProvider'
import { writable, derived } from 'svelte/store';
import BN from 'bignumber.js'

let errors = writable([]);
const approvalDetails = writable(null);
let autoConfirm = writable(false);

let lamdenBalance = derived([storedWallet, networkInfo],
     async ([$storedWallet, $networkInfo], set) => {
        if ($storedWallet && $networkInfo && $storedWallet.vk) {
            set(await checkLamdenBalance());
        } else {
            set(BN(0));
        }
    }
)

const logout = () => {
    lockWallet();
}

const approve = () => {
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
                },
                params.origin
            );
            if (tx.resultInfo.type === 'error') {
                errors.set(tx.resultInfo.errorInfo);
                return;
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

const extractBaseUrlFromOrigin = (origin) => {
    var pathArray = origin.split( '/' );
    var protocol = pathArray[0];
    var host = pathArray[2];
    return protocol + '//' + host;
}

loggedInEvent.on('loggedIn', () => {
    const params = parseParams(window.location.search);
    console.log(params);
    const shouldAutoApproveHash = (
        localStorage.getItem('autoApprove') ||
        sessionStorage.getItem('autoApprove') ||
        {}
    )
    if (params.origin && params.type && params.type==='login') {
        approvalDetails.set(params)
        let baseOrigin = extractBaseUrlFromOrigin(params.origin);
        if ($autoConfirm) {
            shouldAutoApproveHash[baseOrigin] = true;
            localStorage.setItem('autoApprove', shouldAutoApproveHash);
            sessionStorage.setItem('autoApprove', shouldAutoApproveHash);
        }
        if (shouldAutoApproveHash.hasOwnProperty(baseOrigin) && shouldAutoApproveHash[baseOrigin] === true) {
            // auto approve
            setTimeout(()=>{
                approve();
            }, 10);            
        }

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
        if (shouldAutoApproveHash.hasOwnProperty(baseOrigin) && shouldAutoApproveHash[baseOrigin] === true) {
            // auto approve
            setTimeout(()=>{
                approve();
            }, 10);            
        }
    }
    console.log('Logged in!');
});

</script>

<Container>
    <h2>
        My Lamden Wallet
    </h2>
</Container>

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
        <p>Balance: {$lamdenBalance} TAU</p>
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
                onClick={reject}
            >
                Reject
            </Button>   
            <Button 
                onClick={approve}
            >
                Approve
            </Button>   
        </Container>
        {/if}
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
