<script>
  import { getWalletFromMnemonic } from '../../utils/walletProvider/lamdenProvider'
import Button from '../Core/Button.svelte';
import Container from '../Core/Container.svelte';
import AccountsSelector from './AccountsSelector.svelte';
import { storeWallet } from '../../utils/wallet-seed'
import { writable } from 'svelte/store';
import { onMount } from 'svelte';

  export let goBack, mnemonic, password, selectedWalletIndex = 0;
  
  let selectedWallet = writable(null);
  let wallets = writable([]);

  onMount(()=>{
    let derivedWallets = [...Array(10)].map((_, idx) => {
      return getWalletFromMnemonic(
        $mnemonic,
        idx,
      );
    });
    selectedWallet.set(derivedWallets[selectedWalletIndex]);
    wallets.set(derivedWallets);
  })

  function submit() {
    storeWallet(
      $selectedWallet,
      $password,
    );
  }
</script>



<Container>
  <AccountsSelector
    wallets={wallets}
    selectedWallet={selectedWallet}
    onClick={(wallet)=>selectedWallet.set(wallet)}
  />
  <Container>
    <Button color="cancel" onClick={goBack}>Back</Button>
    <Button disabled={$selectedWallet === null} color="primary" onClick={submit}>
      Restore
    </Button>
  </Container>
</Container>