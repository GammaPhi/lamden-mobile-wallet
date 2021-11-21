<script>
import { writable } from 'svelte/store'
import Button from '../Core/Button.svelte';
import Container from "../Core/Container.svelte";
export let mnemonicAndSeed, goForward;
import {
  normalizeMnemonic,
} from '../../utils/wallet-seed';


const confirmed = writable(false);
const downloaded = writable(false);
const showVerification = writable(false);
const seedCheck = writable('');
const verified = writable(false);

const downloadMnemonic = (mnemonic) => {
    const url = window.URL.createObjectURL(new Blob([mnemonic]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'lamden-seed.txt');
    document.body.appendChild(link);
    link.click();
}

const verifyMnemonic = () => {
    if(normalizeMnemonic($seedCheck) === $mnemonicAndSeed.mnemonic) {
        verified.set(true);
    } else {
        verified.set(false);
    }
}
</script>

<style>
    div.mnemonic {
        margin-left: auto;
        margin-right: auto;
        max-width: 400px;
        font-weight: bold;
        border: 1px solid var(--primary-color)
    }
</style>

<Container>
    <h4>
        Create New Wallet
    </h4>
    {#if !$showVerification}
        <p>
            Create a new wallet to hold TAU and Lamden tokens.
        </p>
        <p>
            Please write down the following twenty four words and keep them in a
            safe place:
        </p>
        {#if $mnemonicAndSeed}
            <div class="mnemonic">
                {$mnemonicAndSeed.mnemonic}
            </div>
        {:else}
            Loading...
        {/if}
        <p>
            Your private keys are only stored on your current computer or device.
            You will need these words to restore your wallet if your browser's
            storage is cleared or your device is damaged or lost.
        </p>
        <label>
            I have saved these words in a safe place.
            <br />
            <input 
                type="checkbox"
                checked={$confirmed}
                disabled={!$mnemonicAndSeed}
                on:change={(e) => confirmed.set(e.target.checked)}
            />
        </label>
        <Button variant="contained" color="primary" style={{ marginTop: 20 }} onClick={() => {
            downloadMnemonic($mnemonicAndSeed.mnemonic);
            downloaded.set(true);
        }}>
            Download Backup Mnemonic File (Required)
        </Button>
        <Button color="primary" disabled={!$confirmed || !$downloaded} onClick={() => showVerification.set(true)}>
            Continue
        </Button>

    {:else}
        <div>
            Confirm Seed Phrase        
        </div>
        <textarea 
            disabled={!$mnemonicAndSeed}
            on:change={(e) => seedCheck.set(e.target.value)}
        /><br/>
        <Button color="primary" disabled={!$confirmed || !$downloaded} onClick={() => verifyMnemonic()}>
            Verify
        </Button>
        {/if}

        {#if $verified}
        <Button color="primary" disabled={!$verified || !$confirmed || !$downloaded} onClick={() => goForward()}>
            Continue
        </Button>
    {/if}
</Container>