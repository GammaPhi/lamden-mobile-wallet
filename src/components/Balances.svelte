<script>
import { onMount } from 'svelte'
import { writable } from 'svelte/store'
import { stringToFixed } from '../utils/utils';
import { checkTokenBalance } from '../utils/walletProvider/lamdenProvider';
import Container from './Core/Container.svelte'
import Refresh from './Core/Refresh.svelte';
import SendTauInlineForm from './Forms/SendTauInlineForm.svelte';
import { networkInfo, networkChangedEvent } from '../stores/globalStore';
import { getTokenList, getTokenDetails, getInitialTokensDetails, addToken, removeToken } from '../utils/tokens';
import Input from './Core/Input.svelte';
import Button from './Core/Button.svelte';
import TokenCustom from './Tokens/Token_Custom.svelte';
import TokenTau from './Tokens/Token_TAU.svelte';

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
            } else if (details.contract === 'con_phi') {
                // manually set for now
                details.token = 'PHI';
                details.name = 'Gamma Phi';
                details.type = 'svg+xml'
                details.base64 = 'PHN2ZyB3aWR0aD0iMTAwJSIgdmlld0JveD0iMCAwIDQ4IDQ4IiBmaWxsPSIjMzcyMzc0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDguMDAwMDAwLDQwLjAwMDAwMCkgc2NhbGUoMC4wMDMyNzUsLTAuMDAzOTUxKSIgZmlsbD0iIzM3MjM3NCIgc3Ryb2tlPSJub25lIj4KICAgIDxwYXRoIGQ9Ik0yNTQwIDc4MDUgbDAgLTI4NSA3OTEgMCA3OTAgMCAtMyAtMjY3IGMtMyAtMjg5IC02IC0zMDUgLTU2IC0zMjQKLTE1IC02IC0xNjIgLTE1IC0zMjcgLTIwIC01MDAgLTE1IC04NDcgLTUyIC0xMjUwIC0xMzQgLTg3NCAtMTc1IC0xNDUyIC00NDEKLTE4MzUgLTg0MiAtMzI0IC0zMzggLTUzOSAtODA5IC02MjIgLTEzNTggLTIxIC0xNDMgLTE4IC02MDkgNiAtNzYwIDgzIC01MzQKMzA4IC0xMDA2IDY0MSAtMTM0MCAzMjMgLTMyNiA3MzMgLTU0NCAxMjgwIC02ODMgNDM4IC0xMTEgODUxIC0xNzAgMTcyNSAtMjQ3CjIyMiAtMTkgNDA4IC0zOSA0MTIgLTQzIDIxIC0yMSAyOCAtMTQ3IDI4IC01MjggbDAgLTQxNCAtNzkwIDAgLTc5MCAwIDAgLTI4MAowIC0yODAgMjM2NSAwIDIzNjUgMCAwIDI4MCAwIDI4MCAtNzk1IDAgLTc5NSAwIDAgNDczIDAgNDc0IDE5MyA3IGMzODkgMTQKOTYxIDY2IDEzMzIgMTIyIDMxMyA0NiA3NzIgMTc2IDEwNjUgMzAxIDYxNSAyNjMgMTAzNCA2NTQgMTI2NSAxMTgzIDE3MCAzODkKMjU2IDg3NCAyMjUgMTI3NSAtMzggNTA0IC0xOTcgOTYxIC00NjYgMTMzNSAtNzQgMTA0IC0yNTMgMjkxIC0zNTggMzc2IC01MjcKNDIzIC0xMzE5IDY2MCAtMjUzMSA3NTkgLTU4MyA0NyAtNjM3IDU1IC02ODIgOTcgLTM3IDM1IC00MyA4MCAtNDMgMzI2IGwwCjIzMiA3OTUgMCA3OTUgMCAwIDI4NSAwIDI4NSAtMjM2NSAwIC0yMzY1IDAgMCAtMjg1eiBtMzM2OCAtMTMyNSBjNDk1IC00OQo4MjEgLTEzMCAxMTI3IC0yODAgMzYyIC0xNzcgNjAyIC00MDcgNzcwIC03NDAgOTkgLTE5NyAxNTMgLTM2NyAxNzkgLTU3MCA0OQotMzc1IDQ1IC0xMDg2IC05IC0xNDI1IC03MCAtNDQwIC0zMTAgLTgxNyAtNjg1IC0xMDc0IC0zNTggLTI0NSAtNzY3IC0zNzUKLTEzMTAgLTQxNiAtMTA3IC04IC0yMTkgLTE3IC0yNDcgLTE5IGwtNTMgLTUgMCAyMjc1IGMwIDE2NDQgMyAyMjc0IDExIDIyNzQKNiAwIDEwNCAtOSAyMTcgLTIweiBtLTE3ODggLTIyNjUgbDAgLTIyNzYgLTMyIDUgYy0xOCAzIC05NCAxMCAtMTY4IDE2IC05MTcKNzIgLTE1MDMgMzU0IC0xODU0IDg5MiAtMTAwIDE1MyAtMTkyIDM2NiAtMjQxIDU1NSAtNTMgMjAzIC04MiA2OTQgLTY1IDExMDEKMTEgMjgwIDIyIDM3MSA2MCA1MTggMTE2IDQ0MiAzNzggODIwIDczMiAxMDU3IDM0MSAyMjggOTU5IDM5NyAxNDgxIDQwNiBsODcKMSAwIC0yMjc1eiIvPgogIDwvZz4KPC9zdmc+Cg=='
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
                        token={token}
                        />
                        {#if token !== 'currency'}
                            <div
                            class="remove"
                                on:click={()=>removeTokenByContract(token)}
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

