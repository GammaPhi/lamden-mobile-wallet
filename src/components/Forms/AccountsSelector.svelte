
<script>
import Container from "../Core/Container.svelte";
import { shortenAddress } from '../../utils/utils';

export let wallets, selectedWallet, onClick = false;

</script>

<style>
 
</style>

<Container>
  <h4>
    Derivable Accounts
  </h4>
  {#each $wallets as acc}
    <label for={acc.vk}>
    <input 
        type="radio"
        name="choice"
        id={acc.vk}
        value={$selectedWallet===acc}
        on:click={onClick ? () => onClick(acc) : {}}
      />
      {shortenAddress(acc.vk.toString())}
      </label>
    <br />
  {/each}
</Container>