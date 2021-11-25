<script>
    import Container from "../Core/Container.svelte";
    import { writable, derived } from "svelte/store"
    import Button from "../Core/Button.svelte";
    import BN from 'bignumber.js'
    import { sendTransaction } from '../../utils/walletProvider/lamdenProvider'

    export let onCancelButtonClick, token;

    const validateVk = (k) => {
      return k.length === 64;
    }
    
    const address = writable('');
    const amount = writable(BN(0));
    const sending = writable(false);

    const isSendBtnEnabled = derived([address, amount, sending], 
            ([$address, $amount, $sending]) => {
                if (!$sending && validateVk($address) && $amount.length>0 && BN($amount) > BN(0)) {
                    return true;
                }
                return false;
            })
    
    const onSendButtonClick = () => {
        if (confirm(`Are you sure you want to send ${$amount} ${token.token} to ${$address}?`)) {
            sending.set(true);
            sendTransaction(
                token.contract,
                "approve",
                {
                    amount: { __fixed__: BN($amount).toString()},
                    to: $address
                },
                90,
                (result) => {
                    console.log(result);
                    sendTransaction(
                        token.contract,
                        "transfer",
                        {
                            amount: { __fixed__: BN($amount).toString()},
                            to: $address
                        },
                        90,
                        (result) => {
                            console.log(result);
                            sending.set(false);
                            amount.set(BN(0));
                            address.set('');
                            alert("Success!");
                        }
                    )
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