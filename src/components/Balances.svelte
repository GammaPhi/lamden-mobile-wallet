<script>
import { onMount } from 'svelte'
import { writable } from 'svelte/store'
import { stringToFixed } from '../utils/utils';
import { checkTokenBalance } from '../utils/walletProvider/lamdenProvider';
import Container from './Core/Container.svelte'
import Refresh from './Core/Refresh.svelte';
import SendTauInlineForm from './Forms/SendTauInlineForm.svelte';
import { networkInfo, networkChangedEvent } from '../stores/globalStore';
import { getTokenList,  getTokenDetails, forgetAllTokens, getInitialTokensDetails, addToken, removeToken } from '../utils/tokens';
import Input from './Core/Input.svelte';
import Button from './Core/Button.svelte';
import TokenCustom from './Tokens/Token_Custom.svelte';
import TokenTau from './Tokens/Token_TAU.svelte';
import Link from './Core/Link.svelte';

const tokens = writable([]);
const tokensDetails = writable({});
const tokenContract = writable('');
const errors = writable([]);

onMount(async () => {
    tokens.set(getTokenList());
    tokensDetails.set(await getInitialTokensDetails());
    await refresh();
    networkChangedEvent.on("networkChanged", refresh);
});

const refresh = async () => {
    let _tokens = getTokenList();
    let _tokensDetails = $tokensDetails;
    for (var i = 0; i < _tokens.length; i++) {
        let token = _tokens[i];
        getTokenDetails(token).then((details)=>{
            if (details.contract === 'currency') {
                details.token = $networkInfo.network.currencySymbol;
                details.name = 'Lamden';
                details.type = 'svg+xml';
                console.log(details);
            }        
            if (!details.name) {
                removeToken(details.contract);
                errors.set(['Unable to import '+details.contract+'.']);
            } else {
                checkTokenBalance(details.contract).then((amount)=>{
                    console.log(details.contract);
                    console.log("Amount: "+amount.toString());
                    details.balance = stringToFixed(amount, details.precision || 4);
                    details.displaySend = (($tokensDetails[details.contract] || {}).displaySend || false);
                    _tokensDetails[details.contract] = details;
                    tokens.set(_tokens);
                    tokensDetails.set(_tokensDetails);                
                });
            }
        })
    }
}

const addTokenByContract = async () => {
    addToken($tokenContract);
    tokenContract.set('');
    await refresh();
}

const removeTokenByContract = async (token) => {
    if (confirm("Are you sure you want to remove the token contract "+token+"?")) {
        removeToken(token);
        await refresh();
    }
}

</script>



<Container>
    <h2>Balances <Refresh onClick={refresh} timeout={3000} /></h2>
    
    <table>
        {#each $tokens as token}
            {#if $tokensDetails.hasOwnProperty(token) && $tokensDetails[token] !== null}
                <tr>
                    <td class="first">
                        <div class="logo">
                            {#if token === 'currency'}
                            <TokenTau />
                            {:else}
                                {#if $tokensDetails[token].type}
                                <TokenCustom 
                                    base64Image={$tokensDetails[token].base64}
                                    type={$tokensDetails[token].type} 
                                />
                                {/if}
                            {/if}
                        </div>
                    </td>
                    <td class="second">
                        <span>
                            {$tokensDetails[token].name || '-'}
                        </span>
                    </td>
                    <td class="third">
                        <span>
                        {$tokensDetails[token].balance || '-'}
                        {$tokensDetails[token].token || ''}        
                        </span>
                    </td>
                    <td class="fourth">
                        <i 
                        class="fas {$tokensDetails[token]['displaySend'] ? 'fa-chevron-circle-up' : 'fa-chevron-circle-down'}"
                        on:click={()=>{let prevState=$tokensDetails[token]['displaySend'];; $tokens.forEach((t)=>$tokensDetails[t]['displaySend']=false); $tokensDetails[token]['displaySend']=!prevState}}
                        />
                    </td>
                </tr>
                {#if $tokensDetails[token]['displaySend']}
                <tr>
                    <td colspan="4" class="inline-form">
                        <SendTauInlineForm 
                        onCancelButtonClick={()=>{$tokensDetails[token]['displaySend']=false;}}
                        onFinished={()=>{refresh()}}
                        token={$tokensDetails[token]}
                        />
                        {#if token !== 'currency'}
                            <div
                            class="remove"
                                on:click={()=>{$tokensDetails[token]['displaySend']=false; removeTokenByContract(token)}}
                            >
                            Remove Token Contract
                            </div>
                        {/if}
                    </td>
                </tr>
                {/if}
            {:else}
            <tr>
                <td colspan="4">
                Loading...
                </td>
            </tr>
            {/if}
        {/each}
    </table>
    <br />
    <Link
        onClick={async ()=>{if(confirm("This will reset the token list to the default. Are you sure you want to continue?")) {forgetAllTokens(); await refresh()}}}
    >
        Reset Token List
    </Link>
    <br />
    <br />

    <Input 
        label="Add Token Contract"
        onClick={tokenContract.set}
        value={$tokenContract}
        onEnterButton={addTokenByContract}
    />
    {#each $errors as error}
    <p class="bold red">
        {error}
    </p>
    {/each}
    <Button
        onClick={addTokenByContract}
    >
        Add
    </Button>
</Container>

<style>
    .logo {
        height: 30px;
        width: 30px;
        margin-top: auto;
        margin-bottom: auto;        
        margin-left: auto;
        margin-right: auto;
        display: inline-flex;
    }
    td span {
        margin-left: 5px;
        vertical-align: middle;
        display: inline-flex;
        padding-bottom: 5px;
    }
    td {
        text-align: left;
    }
    td.first {
        width: 30px;
    }
    td.third {
        text-align: right;
    }

    .remove {
      cursor: pointer;
      color: red;
      font-weight: bold;
      border-bottom: 2px solid red;
      margin-left: auto;
      margin-right: auto;
      width: max-content;
    }
</style>

