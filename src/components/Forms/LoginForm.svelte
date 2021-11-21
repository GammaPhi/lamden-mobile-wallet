<script>
import Button from "../Core/Button.svelte";
import { writable } from "svelte/store"
import Container from "../Core/Container.svelte";
import Input from "../Core/Input.svelte";
import { loadWallet } from '../../utils/wallet-seed'
const password = writable('');

const submit = () => {
  loadWallet($password);
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
    <Button color="primary" onClick={submit}>
        Unlock
    </Button>
    </Container>
</Container>