import type { Chain } from 'viem'

import PharosChainIcon from '../assets/chain-pharos.svg'
import EduChainIcon from '../assets/chain-edu.svg'
import MonadChainIcon from '../assets/chain-monad.svg'

const pharosDevnetRpcURI: string = import.meta.env.VITE_PHAROS_DEVNET_RPC_URI;
const pharosTestnetRpcURI: string = import.meta.env.VITE_PHAROS_TESTNET_RPC_URI;

/**
 * ============ TESTNET ===========
 */

const pharosTestnet = {
    id: 688688,
    name: 'Pharos Testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'Pharos Test Token',
        symbol: 'PHRS',
    },
    rpcUrls: {
        default: {
            http: [
                'https://testnet.dplabs-internal.com',
            ],
            webSocket: ['wss://testnet.dplabs-internal.com']
        },
        private: {
            http: [
                pharosTestnetRpcURI,
            ],
        },
    },
    blockExplorers: {
        default: {
            name: 'Explorer',
            url: 'https://testnet.pharosscan.xyz/'
        }
    },
} as const satisfies Chain;

const monadTestnet = {
    id: 10143,
    name: 'Monad Testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'MON',
        symbol: 'MON',
    },
    rpcUrls: {
        default: {
            http: [
                'https://testnet-rpc.monad.xyz',
            ],
        },
    },
    blockExplorers: {
        default: {
            name: 'Explorer',
            url: 'https://testnet.monadexplorer.com/'
        }
    },
} as const satisfies Chain;

const eduChainTestnet = {
    id: 656476,
    name: 'EDU Chain Testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'EDU',
        symbol: 'EDU',
    },
    rpcUrls: {
        default: {
            http: [
                'https://rpc.open-campus-codex.gelato.digital',
            ],
            webSocket: [
                'wss://ws.open-campus-codex.gelato.digital'
            ]
        },
    },
    blockExplorers: {
        default: {
            name: 'Explorer',
            url: 'https://edu-chain-testnet.blockscout.com/'
        }
    },
} as const satisfies Chain;

/**
 * =============== DEVNET ============
 */

const pharosDevnet = {
    id: 50002,
    name: 'Pharos Devnet',
    nativeCurrency: {
        decimals: 18,
        name: 'Pharos Test Token',
        symbol: 'PTT',
    },
    rpcUrls: {
        default: {
            http: [
                'https://devnet.dplabs-internal.com',
            ],
            webSocket: ['wss://devnet.dplabs-internal.com']
        },
        private: {
            http: [
                pharosDevnetRpcURI,
            ],
        },
    },
    blockExplorers: {
        default: {
            name: 'Explorer',
            url: 'https://devnet.pharosscan.xyz/'
        }
    },
} as const satisfies Chain;

interface ChainMetadata {
    id: number;
    name: string;
    icon: string;
    blockExplorerURI: string;
    rpcHttpUri: string;
}

const chainMetadataByChainId: Record<number, ChainMetadata> = {
    [10143]: {
        id: monadTestnet.id,
        name: monadTestnet.name,
        icon: MonadChainIcon,
        blockExplorerURI: monadTestnet.blockExplorers.default.url,
        rpcHttpUri: monadTestnet.rpcUrls.default.http[0],
    },
    [656476]: {
        id: eduChainTestnet.id,
        name: eduChainTestnet.name,
        icon: EduChainIcon,
        blockExplorerURI: eduChainTestnet.blockExplorers.default.url,
        rpcHttpUri: eduChainTestnet.rpcUrls.default.http[0],
    },

    [688688]: {
        id: 688688,
        name: 'Pharos Testnet',
        icon: PharosChainIcon,
        blockExplorerURI: pharosTestnet.blockExplorers.default.url,
        rpcHttpUri: pharosTestnet.rpcUrls.private.http[0],
    }
}

export type { ChainMetadata };

export {
    chainMetadataByChainId,

    eduChainTestnet,
    monadTestnet,
    pharosDevnet,

    pharosTestnet,
};