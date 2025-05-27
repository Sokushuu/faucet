import {
    createConfig,
    http,
    cookieStorage,
    createStorage,
} from 'wagmi';
import type { Config } from 'wagmi';
import { injected } from 'wagmi/connectors';
import {
    eduChainTestnet,
    monadTestnet,
    pharosTestnet,

    pharosDevnet,
} from './chain';

const walletConfig: Config = createConfig({
    chains: [
        eduChainTestnet,
        monadTestnet,
        pharosTestnet,

        pharosDevnet,
    ],
    ssr: false,
    storage: createStorage({
        storage: cookieStorage,
    }),
    connectors: [injected()],
    transports: {
        [eduChainTestnet.id]: http(),
        [monadTestnet.id]: http(),
        [pharosTestnet.id]: http(pharosTestnet.rpcUrls.default.http[0]),
        [pharosDevnet.id]: http(pharosDevnet.rpcUrls.default.http[0]),
    },
})

export { walletConfig }