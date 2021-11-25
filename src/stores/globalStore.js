import { writable, derived } from 'svelte/store'
import * as networks from '../utils/networks'
import EventEmitter from 'events';

class LoggedInEventEmitter extends EventEmitter {}

export const loggedInEvent = new LoggedInEventEmitter();

export const EMPTY_WALLET = {
    mnemonic: null,
    derivationIndex: null,
    vk: null,
    sk: null,
};

export const storedWallet = writable(EMPTY_WALLET);
export const loggedIn = derived(storedWallet, ($storedWallet)=>{
    if ($storedWallet===EMPTY_WALLET) {
        return false;
    } else {
        loggedInEvent.emit('loggedIn');
        return true;
    }
});

export const selectedNetwork =  writable("mainnet")
export const networkInfo = derived(selectedNetwork, ($selectedNetwork) => networks[$selectedNetwork])
