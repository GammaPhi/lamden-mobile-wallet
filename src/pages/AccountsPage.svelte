<script>
import Button from '../components/Core/Button.svelte';
import Container from '../components/Core/Container.svelte';
import { navigateHome } from '../utils/navigation-utils'
import { derived, writable } from 'svelte/store'
import AccountsSelector from '../components/Forms/AccountsSelector.svelte';
import { onMount } from 'svelte';
import { storeWallet, loadWallet } from '../utils/wallet-seed'
import { storedWallet, networkChangedEvent } from '../stores/globalStore';
import { getWalletFromMnemonic } from '../utils/walletProvider/lamdenProvider'
import Input from '../components/Core/Input.svelte';
import { shortenAddress } from '../utils/utils';

const selectedWallet = writable(null);
const wallets = writable([]);
const password = writable('');

const isSavingBtnEnabled = derived([password, selectedWallet, storedWallet], 
  ([$password, $selectedWallet, $storedWallet]) => {
    return $password.length > 0 && $selectedWallet !== null && $selectedWallet.vk !== $storedWallet.vk;
});

const errors = writable([]);
const success = writable(null);

onMount(() => {
    selectedWallet.set($storedWallet);
    const availableWallets = [];
    if ($storedWallet.hasOwnProperty('derivationIndex') && 
        $storedWallet.hasOwnProperty('mnemonic')) {

        for (var i = 0; i < 10; i++) {
            if (i === $storedWallet.derivationIndex) {
                availableWallets.push($storedWallet);
            }  else {
                availableWallets.push(getWalletFromMnemonic($storedWallet.mnemonic, i));
            }
        }
    } else {
      availableWallets.push($storedWallet);
    }
    wallets.set(availableWallets);
});

function submit() {
  // check password
  success.set(null);
  try {
    loadWallet($password);

    // store wallet
    storeWallet(
      $selectedWallet,
      $password,
    );
    errors.set([]);
    networkChangedEvent.emit("networkChanged");
    success.set(true);

  } catch (e) {
    console.log("Invalid password");
    password.set('');
    errors.set(["Incorrect password"]);
  }
}

</script>


<Container>
  <h2>
    Your Accounts
  </h2>

  {#if $storedWallet.vk!== null && !$storedWallet.mnemonic}
  <p>
    Only wallets created from a Mnemonic have multiple derivable accounts.
  </p>
  {/if}

  <AccountsSelector
    wallets={wallets}
    selectedWallet={selectedWallet}
    onClick={(wallet)=>selectedWallet.set(wallet)}
    allowExportKeys={true}
    showHeader={false}
  />

  <Container>
    <Input
      label="Password"
      type="password"
      autoComplete="current-password"
      value={$password}
      onClick={password.set}
    />
    <Container>
        {#each $errors as error}
        <p class="bold red">
            {error}
        </p>
        {/each}
        {#if $success === true && $errors.length === 0}
        <p>
          Successfully switched to {shortenAddress($storedWallet.vk)}
        </p>
        {/if}
    </Container>
    <Button
        color="primary"
        disabled={!$isSavingBtnEnabled}
        onClick={submit}
    >
        Switch
    </Button>
    </Container>
</Container>
