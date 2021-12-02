import Lamden from 'lamden-js';
import BN from 'bignumber.js'
import { get } from 'svelte/store'
import { storedWallet, EMPTY_WALLET, networkInfo } from '../../stores/globalStore'

export function getWalletFromMnemonic(mnemonic, derivationIndex) {
    let lamdenWallet = Lamden.wallet.new_wallet_bip39(mnemonic, derivationIndex)
    return lamdenWallet;
};

export function getVkFromSk(sk) {
    return Lamden.wallet.get_vk(sk);
}

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
    console.log("TxInfo: ");
    console.log(txInfo);
    let tx = new Lamden.TransactionBuilder(network, txInfo);

    tx.events.on('response', (response) => {
        if (response.errors || response.result) {
            if (callback) {
                callback(response, tx);
            }
        }
    })
    tx.send(wallet.sk).then(() => tx.checkForTransactionResult())
};

export function sendTransactionResponse(message, origin) {
    if (window.opener) {
        let targetWindow = window.opener;
        console.log("Sending response to window opener.");
        console.log(message);
        targetWindow.postMessage({
            jsonrpc: '2.0',
            ...message
        }, origin);
    } else {
        console.log("No window opener found.");
    }
}


export async function checkLamdenBalance() {
    let apiLink = get(networkInfo).apiLink;
    let wallet = get(storedWallet);
    let vk = wallet.vk;
    try {
        const res = await fetch(
            `${apiLink}/states/currency/balances/${vk}`, {
                method: 'GET',
            },
        )
        return await getValueFromResponse(res)
    } catch (error) {
        console.log({error})
        return new BN(0)
    }
}

export async function checkTokenBalance(token_contract) {
    let apiLink = get(networkInfo).apiLink;
    let wallet = get(storedWallet);
    let vk = wallet.vk;
    let url = `${apiLink}/states/${token_contract}/balances/${vk}`;
    console.log(url);
    try {
        const res = await fetch(
            url, {
                method: 'GET',
            },
        )
        return await getValueFromResponse(res)
    } catch (error) {
        console.log({error})
        return new BN(0)
    }
}

export async function loadTokenInfo(token_contract) {
    let apiLink = get(networkInfo).apiLink;
    let pngUrl = `${apiLink}/states/${token_contract}/metadata/token_logo_base64_png`;
    let svgUrl = `${apiLink}/states/${token_contract}/metadata/token_logo_base64_svg`;
    let symbolUrl = `${apiLink}/states/${token_contract}/metadata/token_symbol`;
    let nameUrl = `${apiLink}/states/${token_contract}/metadata/token_name`;
    let ret = {
        contract: token_contract
    };
    try {
        let res = await fetch(
            pngUrl, {
                method: 'GET',
            },
        )
        let json = await res.json()
        let value = json.value
        if (value) {
            ret['type'] = 'png';
            ret['base64'] = value;
        } else {
            // try svg
            res = await fetch(
                svgUrl, {
                    method: 'GET',
                },
            )
            json = await res.json()
            value = json.value
            if (value) {
                ret['type'] = 'svg+xml';
                ret['base64'] = value;
            }
        }
        
    } catch (error) {
        console.log({error})
    }
    try {
        {
            let res = await fetch(
                nameUrl, {
                    method: 'GET',
                },
            )
            let json = await res.json()
            ret['name'] = json.value;
        }
        {
            let res = await fetch(
                symbolUrl, {
                    method: 'GET',
                },
            )
            let json = await res.json()
            ret['token'] = json.value;
        }
    } catch (error) {
        console.log({error})
    }
    console.log(ret);
    return ret;
}


async function getValueFromResponse(res){
    if (res.status === 200) {
        let json = await res.json()
        let value = json.value
        if (value) {
            if (value.__fixed__) return new BN(value.__fixed__)
            else return new BN(value)
        } else {
            return new BN(0)
        }
    } else {
        return new BN(0)
    }
}