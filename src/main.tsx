import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { RelayKitProvider } from '@reservoir0x/relay-kit-ui'
import '@rainbow-me/rainbowkit/styles.css'
import { config } from './config/wagmi'
import App from './App'
import './App.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({
          accentColor: '#e8b239',
          accentColorForeground: '#0a0a0a',
          borderRadius: 'medium',
          fontStack: 'system',
        })}>
          <RelayKitProvider
            options={{
              appName: '$ARCA Presale',
              source: 'arca-presale',
            }}
            theme={{
              primaryColor: '#fbbf24',
              focusColor: '#f59e0b',
              subtleBackgroundColor: '#111215',
              subtleBorderColor: 'rgba(255,255,255,0.06)',
              text: {
                default: '#e8e6e1',
                subtle: '#8a8780',
              },
              buttons: {
                primary: {
                  color: '#0a0a0a',
                  background: '#fbbf24',
                  hover: { color: '#0a0a0a', background: '#f59e0b' },
                },
              },
              widget: {
                background: '#111215',
                borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.06)',
              },
            }}
          >
            <App />
          </RelayKitProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)
