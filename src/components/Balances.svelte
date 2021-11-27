<script>
import { onMount } from 'svelte'
import { writable } from 'svelte/store'
import { stringToFixed } from '../utils/utils';
import { checkTokenBalance } from '../utils/walletProvider/lamdenProvider';
import Container from './Core/Container.svelte'
import Refresh from './Core/Refresh.svelte';
import SendTauInlineForm from './Forms/SendTauInlineForm.svelte';
import { networkInfo, networkChangedEvent } from '../stores/globalStore';
import { TOKENS } from '../utils/tokens';

const tokens = writable(TOKENS);

onMount(async () => {
    await refresh();
    networkChangedEvent.on("networkChanged", refresh);
});

const refresh = async () => {
    let _tokens = TOKENS.map((v)=>v);
    for (var i = 0; i < _tokens.length; i++) {
        var token = _tokens[i];
        if (token.name === 'Lamden') {
            token.token = $networkInfo.network.currencySymbol;
        }
        var amount = await checkTokenBalance(token.contract);
        token.balance = stringToFixed(amount, token.precision);
    }
    tokens.set(_tokens);
}

</script>

<Container>
    <h2>Balances <Refresh onClick={refresh}/></h2>
    
    <table>
        {#each $tokens as token}
            <tr>
                <td class="first">
                    <div class="logo">
                        <svelte:component this={token.logo} />
                    </div>
                </td>
                <td class="second">
                    <span>
                        {token.name}
                    </span>
                </td>
                <td class="third">
                    <span>
                    {token.balance || '-'}
                    {token.token}        
                    </span>
                </td>
                <td class="fourth">
                    <i 
                    class="fas fa-paper-plane"
                    on:click={()=>{$tokens.forEach((t)=>t['displaySend']=false); token['displaySend']=true;}}
                    />                        
                </td>
            </tr>
            {#if token['displaySend']}
            <tr>
                <td colspan="4" class="inline-form">
                    <SendTauInlineForm 
                    onCancelButtonClick={()=>{token['displaySend']=false;}}
                    onFinished={()=>{refresh()}}
                    token={token}
                    />
                </td>
            </tr>
            {/if}
        {/each}
    </table>
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
    i.fa-paper-plane {
        cursor: pointer;
    }
</style>

