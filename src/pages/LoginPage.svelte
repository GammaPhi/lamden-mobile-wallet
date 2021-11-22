<script>
import { writable } from 'svelte/store'
import RestoreWalletForm from '../components/Forms/RestoreWalletForm.svelte'
import LoginForm from '../components/Forms/LoginForm.svelte'
import CreateWalletForm from '../components/Forms/CreateWalletForm.svelte'
import Container from '../components/Core/Container.svelte';
import Link from '../components/Core/Link.svelte';
import { hasWallet } from '../utils/wallet-seed'

const restore = writable(false);
const create = writable(false);
const showLoginForm = hasWallet();

</script>

<Container>
  {#if $restore}
    <RestoreWalletForm goBack={() => restore.set(false)} />
  {:else}
      {#if showLoginForm && !$create}
        <LoginForm /> 
      {:else}
        <CreateWalletForm />
      {/if}
      <br />
      {#if showLoginForm && $create}
      <Link onClick={() => create.set(false)} >
        Login
      </Link>
      <br /><br />
      {/if}
      {#if showLoginForm && !$create}
      <Link onClick={() => create.set(true)} >
        Create new wallet
      </Link>
      <br /><br/>
      {/if}      
      <Link onClick={() => restore.set(true)} >
        Restore existing wallet
      </Link>
  {/if}
</Container>
