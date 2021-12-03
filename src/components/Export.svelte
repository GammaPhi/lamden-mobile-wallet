<script>
import { shortenAddress } from "../utils/utils";
import { writable } from 'svelte/store';
import { storedWallet } from '../stores/globalStore'

import Container from "./Core/Container.svelte";
import Copy from "./Core/Copy.svelte";
import Input from "./Core/Input.svelte";
import Button from "./Core/Button.svelte";
import Link from "./Core/Link.svelte";
import { onDestroy, onMount } from "svelte";
import { loadWallet } from "../utils/wallet-seed";


let exportErrors = writable([]);
let password = writable('');
let exporting = writable(false);
let exported = writable(false);

const exportAccountInfo = () => {
    try {
        loadWallet($password);
        exported.set(true);
        exportErrors.set([]);
    } catch(e) {
        exportErrors.set(["Incorrect password"]);
    }
};

onMount(()=>{
    exported.set(false);
    exporting.set(false);
    password.set('');
    exportErrors.set([]);
    return () => {
        exported.set(false);
        exporting.set(false);
        password.set('');
        exportErrors.set([]);
    }
});

onDestroy(()=>{
    exported.set(false);
    exporting.set(false);
    password.set('');
    exportErrors.set([]);

});

</script>
<style>
    table.keys {
        overflow-wrap: break-word;
        width: 400px;
    }
    .keys .wrap-anywhere {
        overflow-wrap: normal;
    }
</style>


{#if $exporting}
    <Container>
        <h4>
            Export Account Info
        </h4>
        {#if !$exported}
        <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            value={$password}
            onClick={password.set}
            onEnterButton={(e)=>{password.set(e); exportAccountInfo();}}
        />
        {:else}
        <p>Do not share this information with anyone!</p>
        <Container>
            <table class="keys">
                <tbody>
                    <tr>
                        <td>Public Key</td>
                        <td class="wrap-anywhere">
                            {shortenAddress($storedWallet.vk)}
                            <Copy text={$storedWallet.vk} />
                        </td>
                    </tr>
                    <tr>
                        <td>Private Key</td>
                        <td class="wrap-anywhere">
                            {shortenAddress($storedWallet.sk)}
                            <Copy text={$storedWallet.sk} />
                        </td>
                    </tr>
                    {#if $storedWallet.mnemonic}
                    <tr>
                        <td>Mnemonic</td>
                        <td>
                            {$storedWallet.mnemonic}
                            <Copy text={$storedWallet.mnemonic} />
                        </td>
                    </tr>
                    {/if}
                </tbody>
            </table>
        </Container>
        {/if}
    </Container>
    <Container>
        {#each $exportErrors as error}
        <p class="bold red">
            {error}
        </p>
        {/each}
    </Container>
    <Container>
        <Button 
            color="cancel"
            onClick={()=>{password.set('');exporting.set(false);exported.set(false)}}
        >
            Back
        </Button>   
        <Button 
            onClick={exportAccountInfo}
            disabled={$exported}
        >
            Export
        </Button>   
    </Container>
{:else}
    <Link 
        onClick={()=>exporting.set(true)}
    >
        Export Account Info
    </Link>
{/if}