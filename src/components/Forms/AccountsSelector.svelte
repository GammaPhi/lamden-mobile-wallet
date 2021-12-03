
<script>
import Container from "../Core/Container.svelte";
import { shortenAddress } from '../../utils/utils';
import Copy from "../Core/Copy.svelte";

export let wallets, selectedWallet, onClick = false, showHeader=true, allowExportKeys=false;

</script>

<style>
 
</style>

<Container>
  {#if showHeader}
  <h4>
    Derivable Accounts
  </h4>
  {/if}
  {#each $wallets as acc}
    <label for={acc.vk}>
    <input 
        type="radio"
        name="choice"
        id={acc.vk}
        checked={$selectedWallet.vk===acc.vk}
        on:click={onClick ? () => onClick(acc) : {}}
      />
      {shortenAddress(acc.vk.toString())}
      <Copy text={acc.vk.toString()} />
    </label>
    <br />
  {/each}
</Container>