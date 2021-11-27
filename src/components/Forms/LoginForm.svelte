<script>
import Button from "../Core/Button.svelte";
import { writable } from "svelte/store"
import Container from "../Core/Container.svelte";
import Input from "../Core/Input.svelte";
import { loadWallet } from '../../utils/wallet-seed'

const password = writable('');
const errors = writable([]);

const submit = () => {
  try {
    loadWallet($password);
    errors.set([]);
  } catch(e) {
    errors.set(["Incorrect password"]);
  }
}

</script>

<Container>
    <Container>
    <h4>
        Unlock Wallet
    </h4>
    <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        value={$password}
        onClick={password.set}
        onEnterButton={(e)=>{password.set(e); submit();}}
    />
    </Container>
    <Container>
      {#each $errors as error}
      <p class="bold red">
          {error}
      </p>
      {/each}
  </Container>
    <Container>
    <Button color="primary" onClick={submit}>
        Unlock
    </Button>
    </Container>
</Container>