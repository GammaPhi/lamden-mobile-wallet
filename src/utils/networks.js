
export const mainnet = {
    apiLink: "https://mainnet.lamden.io/api",
    addressExplorer: "https://mainnet.lamden.io/addresses",
    network: {
        "name": "Lamden Mainnet", 
        "hosts": ["https://proxy.gammaphi.io"], //["https://masternode-01.lamden.io"],
        "type": "mainnet", 
        "lamden": true, 
        "currencySymbol": "TAU",
        "blockExplorer": "https://mainnet.lamden.io"
    }
}

export const testnet = {
    apiLink: "https://testnet.lamden.io/api",
    addressExplorer: "https://testnet.lamden.io/addresses",

    network: {
        "name": "Lamden Testnet", 
        "hosts": ["https://proxy.gammaphi.io"],//["https://testnet-master-1.lamden.io"], 
        "type": "testnet", 
        "lamden": true, 
        "currencySymbol": "dTAU",
        "blockExplorer": "https://testnet.lamden.io"
    }
} 