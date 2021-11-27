import PHI from '../components/Tokens/Token_PHI.svelte';
import TAU from '../components/Tokens/Token_TAU.svelte';
import LUSD from '../components/Tokens/Token_LUSD.svelte';
import LIQ from '../components/Tokens/Token_LIQ.svelte';


export const TOKENS = [
    {
        name: 'Lamden',
        contract: 'currency',
        token: "TAU",
        logo: TAU,
        precision: 4,
        displaySend: false
    },
    {
        name: 'Lamden USD',
        contract: 'con_lusd_lst001',
        token: "LUSD",
        logo: LUSD,
        precision: 4,
        displaySend: false
    },
    {
        name: 'Gamma Phi',
        contract: 'con_phi',
        token: 'PHI',
        logo: PHI,
        precision: 4,
        displaySend: false
    },
    {
        name: "Liquidus Finance",
        contract: 'con_liquidus_lst001',
        token: "LIQ",
        logo: LIQ,
        precision: 4,
        displaySend: false
    },
];