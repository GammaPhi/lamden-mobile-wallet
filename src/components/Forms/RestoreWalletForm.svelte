<script>
import Container from "../Core/Container.svelte";
import { writable, derived } from "svelte/store"
import DerivedAccounts from "./DerivedAccounts.svelte";
import Button from "../Core/Button.svelte";
import { mnemonicToSeed, normalizeMnemonic, validateMnemonic } from '../../utils/wallet-seed'
import Input from "../Core/Input.svelte";
export let goBack;

const rawMnemonic = writable('');
const seed = writable('');
const password = writable('');
const passwordConfirm = writable('');
const next = writable(false);

const mnemonic = derived(rawMnemonic, ($rawMnemonic)=>normalizeMnemonic($rawMnemonic));
const isNextBtnEnabled = derived([password, passwordConfirm, mnemonic], 
  ([$password, $passwordConfirm, $mnemonic])=>$password.length > 0 && $password === $passwordConfirm && validateMnemonic($mnemonic));
const displayInvalidMnemonic = derived(mnemonic, ($mnemonic)=>validateMnemonic($mnemonic) === false && $mnemonic.length > 0);
  

</script>

{#if $next }
    <DerivedAccounts
      goBack={() => next.set(false)}
      mnemonic={mnemonic}
      password={password}
      seed={seed}
    />
{:else}

    <Container>
      <Container>
        <h4>
          Restore Existing Wallet
        </h4>
        <p>
          Restore your wallet using your twelve or twenty-four seed words.
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
            margin="normal"
            label="Seed Words"
            value={$rawMnemonic}
            on:change={(e) => rawMnemonic.set(e.target.value)}
            on:input={(e) => rawMnemonic.set(e.target.value)}
          />
        </label>
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
        <Button onClick={goBack}>Cancel</Button>
        <Button
          color="primary"
          disabled={!$isNextBtnEnabled}
          onClick={() => {
            mnemonicToSeed($mnemonic).then((s) => {
              seed.set(s);
              next.set(true);
            });
          }}
        >
          Next
        </Button>
      </Container>
    </Container>
{/if}