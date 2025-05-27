import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient } from '@tanstack/react-query'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { WagmiProvider, deserialize, serialize } from 'wagmi'

import './index.css'
import { Faucet } from './pages'
import { walletConfig } from './libs'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1_000 * 60 * 60 * 24 // 24 hours
    }
  }
});

const persister = createSyncStoragePersister({
    serialize,
    storage: window.localStorage,
    deserialize,
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={walletConfig}>
      <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
        <Faucet />
      </PersistQueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)
