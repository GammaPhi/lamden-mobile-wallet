<script>
import Button from "../Core/Button.svelte";
import { writable } from "svelte/store"
import Container from "../Core/Container.svelte";
import Input from "../Core/Input.svelte";


export let goBack, onSubmit;
const password = writable('');
const passwordConfirm = writable('');

</script>
<Container>
    <Container>
        <h4>
        Choose a Password
        </h4>
        <Input
        label="New Password"
        type="password"
        autoComplete="new-password"
        value={$password}
        onClick={password.set}
        />
        <br />
        <Input
        label="Confirm Password"
        type="password"
        autoComplete="new-password"
        value={$passwordConfirm}
        onClick={passwordConfirm.set}
        />
        <div>
        If you forget your password you will need to restore your wallet using
        your seed words.
        </div>
    </Container>
    <Container>
        <Button color="cancel" onClick={goBack}>Back</Button>
        <Button
        color="primary"
        disabled={$password.length === 0 || $password !== $passwordConfirm}
        onClick={() => onSubmit($password)}
        >
        Create Wallet
        </Button>
    </Container>
</Container>
  