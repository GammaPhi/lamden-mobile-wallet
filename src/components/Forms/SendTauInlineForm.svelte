<script>
    import Container from "../Core/Container.svelte";
    import { writable, derived } from "svelte/store"
    import Button from "../Core/Button.svelte";
    import BN from 'bignumber.js'
    import { sendTransaction } from '../../utils/walletProvider/lamdenProvider'

    export let onCancelButtonClick, token, onFinished;

    const validateVk = (k) => {
      return k.length === 64;
    }
    
    const address = writable('');
    const amount = writable(BN(0));
    const sending = writable(false);
    const errors = writable([]);

    const isSendBtnEnabled = derived([address, amount, sending], 
            ([$address, $amount, $sending]) => {
                if (!$sending && validateVk($address) && $amount.length>0 && BN($amount) > BN(0)) {
                    return true;
                }
                return false;
            })
    
    const onSendButtonClick = () => {
        let _amount = $amount;
        let _address = $address;
        let payload = {
            amount: { __fixed__: BN(_amount).toString()},
            to: _address
        }
        console.log("Payload: ");
        console.log(payload);
        if (confirm(`Are you sure you want to send ${_amount} ${token.token} to ${_address}?`)) {
            sending.set(true);
            sendTransaction(
                token.contract,
                "approve",
                payload,
                90,
                (result) => {
                    console.log("Result 1: ");
                    console.log(result);
                    if (result.errors && result.errors.length > 0) {
                        errors.set(result.errors);
                        sending.set(false);
                    } else {
                        sendTransaction(
                            token.contract,
                            "transfer",
                            payload,
                            90,
                            (result) => {
                                console.log("Result 2: ");
                                console.log(result);
                                if (result.errors && result.errors.length > 0) {
                                    errors.set(result.errors);
                                    sending.set(false);
                                } else {
                                    console.log(result);
                                    sending.set(false);
                                    amount.set(BN(0));
                                    address.set('');
                                    onFinished();
                                }
                            }
                        )
                    }
                }
            )
        }
    };
    
    </script>

<Container>
    <Container>
    <label>
    Recipient Address <br/>
    <input
        type="text"
        value={$address}
        on:change={(e) => address.set(e.target.value)}
        on:input={(e) => address.set(e.target.value)}
    />
    </label>
    <label>
        Amount <br/>
    <input
        type="number"
        value={$amount}
        on:change={(e) => amount.set(e.target.value)}
        on:input={(e) => amount.set(e.target.value)}
    />
    </label>

    </Container>
    <Container>
        {#each $errors as error}
        <p class="bold red">
            {error}
        </p>
        {/each}
    </Container>
    <Container>
    <Button color="cancel" onClick={onCancelButtonClick}>Cancel</Button>
    <Button
        color="primary"
        disabled={!$isSendBtnEnabled}
        onClick={onSendButtonClick}
    >
        {#if $sending}
        Sending...
        {:else}
        Send
        {/if}
    </Button>
    </Container>
</Container>