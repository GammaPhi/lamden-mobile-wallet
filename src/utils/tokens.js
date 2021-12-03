import { loadTokenInfo } from './walletProvider/lamdenProvider';

const TOKENS_CONTRACTS_KEY = "lsts";
const TOKEN_DETAILS_PREFIX = "lst001-";


export const DEFAULT_TOKENS = [
    'currency',
    'con_lusd_lst001',
    'con_weth_lst001',
    'con_phi',
    'con_rswp_lst001',
    'con_nebula',
    'con_liquidus_lst001',
    'con_uwarriors_lst001',
    'con_marmite100_contract'
];


export function getTokenList() {
    let tokens = getFromStorage(TOKENS_CONTRACTS_KEY);
    if (!tokens) {
        tokens = DEFAULT_TOKENS;
        setInStorage(TOKENS_CONTRACTS_KEY, tokens);
    }
    return tokens;
}

export async function getInitialTokensDetails() {
    let tokens = getTokenList();
    let details = {};
    for (var i = 0; i < tokens.length; i++) {
        details[tokens[i]] = await getTokenDetails(tokens[i], false);
    }
    return details;
}


export function removeToken(token) {
    let tokens = getTokenList();
    let index = tokens.indexOf(token);
    if (index > -1) {
        tokens.splice(index, 1);
        setInStorage(TOKENS_CONTRACTS_KEY, tokens);
    }
    try {
        deleteFromStorage(TOKEN_DETAILS_PREFIX+tokenDetails.contract);
    } catch (e) {
        console.log(e);
    }
}


export async function getTokenDetails(token, fetchIfNotPresent=true) {
    let details = getFromStorage(TOKEN_DETAILS_PREFIX+token);
    if (!details && fetchIfNotPresent) {
        details = await loadTokenInfo(token);
        storeTokenDetails(details);
    }
    return details;
}

export function addToken(contract) {
    let tokenContracts = getTokenList();
    if (!tokenContracts.includes(contract)) {
        tokenContracts.push(contract)
        setInStorage(TOKENS_CONTRACTS_KEY, tokenContracts);
    }
}


export function storeTokenDetails(tokenDetails) {
    let tokenContracts = getTokenList();
    if (!tokenContracts.includes(tokenDetails.contract)) {
        tokenContracts.push(tokenDetails.contract)
        setInStorage(TOKENS_CONTRACTS_KEY, tokenContracts);
    }
    setInStorage(TOKEN_DETAILS_PREFIX+tokenDetails.contract, tokenDetails);
};

export function forgetAllTokens() {
    let tokenContracts = getTokenList();
    for (var i = 0; i < tokenContracts.length; i++) {
        removeToken(tokenContracts[i]);
    }
    deleteFromStorage(TOKENS_CONTRACTS_KEY);
}


const getFromStorage = (key) => {
    return JSON.parse(
        localStorage.getItem(key)
        || sessionStorage.getItem(key)
        || "null"
    )
};

const setInStorage = (key, data) => {
    let serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
    sessionStorage.setItem(key, serialized);
};

const deleteFromStorage = (key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
};