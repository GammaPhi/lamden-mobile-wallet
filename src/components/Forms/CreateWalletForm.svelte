<script>
import { onMount } from 'svelte';

import { writable } from 'svelte/store'
import ChoosePasswordForm from './ChoosePasswordForm.svelte';
import SeedWordsForm from './SeedWordsForm.svelte';
import { generateMnemonicAndSeed, storeWallet } from '../../utils/wallet-seed'
import { getWalletFromMnemonic } from '../../utils/walletProvider/lamdenProvider';

let mnemonicAndSeed = writable(null);

onMount(async () => {
    mnemonicAndSeed.set(await generateMnemonicAndSeed());
    console.log($mnemonicAndSeed)
});

const savedWords = writable(false);

function submit(password) {
    const { mnemonic, seed } = mnemonicAndSeed;
    const wallet = getWalletFromMnemonic(mnemonic, 0);
    storeWallet(
        wallet, password
    )
}

</script>
   
{#if $savedWords }
    <ChoosePasswordForm
        mnemonicAndSeed={mnemonicAndSeed}
        goBack={() => savedWords.set(false)}
        onSubmit={submit}
    />
{:else}  
    <SeedWordsForm
        mnemonicAndSeed={mnemonicAndSeed}
        goForward={() => savedWords.set(true)}
    />
{/if}