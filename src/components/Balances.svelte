<script>
import { onMount } from 'svelte'
import { writable } from 'svelte/store'
import { stringToFixed } from '../utils/utils';
import { checkTokenBalance } from '../utils/walletProvider/lamdenProvider';
import Container from './Core/Container.svelte'
import Refresh from './Core/Refresh.svelte';
import SendTauInlineForm from './Forms/SendTauInlineForm.svelte';
import PHI from './Tokens/Token_PHI.svelte'
import TAU from './Tokens/Token_TAU.svelte'

const TOKENS = [
    {
        name: 'Lamden',
        contract: 'currency',
        token: 'TAU',
        logo: TAU,
        precision: 4,
        displaySend: false
    },
    {
        name: 'Gamma Phi',
        contract: 'con_phi',
        token: 'PHI',
        logo: PHI,
        precision: 4,
        displaySend: false
    }
]

const tokens = writable(TOKENS);
const showSendForm = writable({});

onMount(async () => {
    await refresh();
});

const refresh = async () => {
    let _tokens = TOKENS.map((v)=>v);
    for (var i = 0; i < _tokens.length; i++) {
        var token = _tokens[i];
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
                    on:click={()=>{token['displaySend']=!token['displaySend']}}
                    />                        
                </td>
            </tr>
            {#if token['displaySend']}
            <tr>
                <td colspan="4" class="inline-form">
                    <SendTauInlineForm 
                    onCancelButtonClick={()=>{token['displaySend']=false;}}
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

