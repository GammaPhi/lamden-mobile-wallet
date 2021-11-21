import Lamden from 'lamden-js';
import { get } from 'svelte/store'
import { storedWallet, EMPTY_WALLET, networkInfo } from '../../stores/globalStore'

export function getWalletFromMnemonic(mnemonic, derivationIndex) {
    let lamdenWallet = Lamden.wallet.new_wallet_bip39(mnemonic, derivationIndex)
    return lamdenWallet;
};

export function sendTransaction(
                    contractName,
                    methodName,
                    kwargs,
                    stampLimit, 
                    callback) {
    let wallet = get(storedWallet);
    let network = get(networkInfo).network;
    if (wallet === EMPTY_WALLET) {
        throw new Error('No wallet found');
    }
    let senderVk = wallet.vk;    
    let txInfo = {
        senderVk,
        contractName: contractName,
        methodName, methodName,
        kwargs,
        stampLimit: stampLimit,
    }
    console.log(txInfo);
    let tx = new Lamden.TransactionBuilder(network, txInfo);
    tx.events.on('response', (response) => {
        if (callback) {
            callback(response, tx);
        }
    })
    tx.send(wallet.sk).then(() => tx.checkForTransactionResult())
};