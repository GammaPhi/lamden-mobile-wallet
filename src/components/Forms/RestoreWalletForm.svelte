<script>
import Container from "../Core/Container.svelte";
import { writable, derived } from "svelte/store"
import DerivedAccounts from "./DerivedAccounts.svelte";
import Button from "../Core/Button.svelte";
import { mnemonicToSeed, normalizeMnemonic, validateMnemonic } from '../../utils/wallet-seed'
import Input from "../Core/Input.svelte";
import { storeWalletFromSk } from '../../utils/wallet-seed'
import Link from "../Core/Link.svelte";

export let goBack;

const validateSk = (k) => {
  return k.length === 64;
}

const rawMnemonic = writable('');
const rawSK = writable('');
const seed = writable('');
const password = writable('');
const passwordConfirm = writable('');
const next = writable(false);

const mnemonic = derived(rawMnemonic, ($rawMnemonic)=>normalizeMnemonic($rawMnemonic));
const sk = derived(rawSK, ($rawSK)=>$rawSK.trim());
const useMnemonic = writable(true);

const isNextBtnEnabled = derived([password, passwordConfirm, mnemonic, sk, useMnemonic], 
  ([$password, $passwordConfirm, $mnemonic, $sk, $useMnemonic])=>
    $password.length > 0 && $password === $passwordConfirm 
    && ((validateMnemonic($mnemonic) && $useMnemonic ) || (validateSk($sk) && !$useMnemonic)));

const displayInvalidMnemonic = derived(mnemonic, ($mnemonic)=>validateMnemonic($mnemonic) === false && $mnemonic.length > 0);
const displayInvalidSK = derived(sk, ($sk)=>validateSk($sk) === false && $sk.length > 0);

const onNextButtonClick = () => {
    if ($useMnemonic) {
      mnemonicToSeed($mnemonic).then((s) => {
        seed.set(s);
        next.set(true);
      });
    } else {
      storeWalletFromSk($sk, $password);
    }
};

</script>


{#if $next }
    <DerivedAccounts
      goBack={() => next.set(false)}
      password={password}
      mnemonic={mnemonic}
      seed={seed}
    />
{:else}
    <Container>
      <Container>
        <h4>
          Restore Existing Wallet
        </h4>
        {#if $useMnemonic}
          <Link
            onClick={()=>useMnemonic.set(false)}
          >
          Restore wallet using a private key
          </Link>
          <br/>
          <p>
            Restore your wallet using your twenty-four seed words.
            Note that this will delete any existing wallet on this device.
          </p>
          {#if $displayInvalidMnemonic}
            <p  class="bold red">
              Mnemonic validation failed. Please enter a valid BIP 39 seed phrase.
            </p>
          {/if}
          <label>
            Seed Words <br/>
            <textarea
              rows={3}
              value={$rawMnemonic}
              on:change={(e) => rawMnemonic.set(e.target.value)}
              on:input={(e) => rawMnemonic.set(e.target.value)}
            />
          </label>
        {:else}
          <Link
            onClick={()=>useMnemonic.set(true)}
          >
          Restore wallet using a seed phrase
          </Link>
          <br/>

          <p>
            Restore your wallet using your private key.
            Note that this will delete any existing wallet on this device.
          </p>
          {#if $displayInvalidSK}
            <p  class="bold red">
              Private key validation failed. Please enter a valid private key.
            </p>
          {/if}
          <label>
            Private Key <br/>
            <input
              value={$rawSK}
              on:change={(e) => rawSK.set(e.target.value)}
              on:input={(e) => rawSK.set(e.target.value)}
            />
          </label>
        {/if}
        <br />
        <Input
        label="New Password"
        type="password"
        autoComplete="new-password"
        value={$password}
        onClick={password.set}
        />
        <br/>
        <Input
        label="Confirm Password"
        type="password"
        autoComplete="new-password"
        value={$passwordConfirm}
        onClick={passwordConfirm.set}
        />

      </Container>
      <Container>
        <Button color="cancel" onClick={goBack}>Cancel</Button>
        <Button
          color="primary"
          disabled={!$isNextBtnEnabled}
          onClick={onNextButtonClick}
        >
        {#if $useMnemonic}
          Next
        {:else}
          Restore
        {/if}
        </Button>
      </Container>
    </Container>
{/if}