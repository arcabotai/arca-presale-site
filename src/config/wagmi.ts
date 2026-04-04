import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { base, mainnet, arbitrum, optimism, polygon, bsc, zkSync, linea, scroll, blast, mode, zora, mantle, avalanche, sonic, berachain, worldchain, redstone, cyber } from 'wagmi/chains'
import { defineChain } from 'viem'

const unichain = defineChain({
  id: 130,
  name: 'Unichain',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: { default: { http: ['https://mainnet.unichain.org'] } },
  blockExplorers: { default: { name: 'Uniscan', url: 'https://uniscan.xyz' } },
})

const projectId = '267a604b2a6d3def9a69504ea62b1280'

export const config = getDefaultConfig({
  appName: '$ARCA Presale',
  projectId,
  chains: [
    base, mainnet, arbitrum, optimism,
    zkSync, linea, scroll, blast, mode, zora, mantle, avalanche,
    polygon, bsc, sonic, berachain,
    unichain, worldchain, redstone, cyber,
  ],
  ssr: false,
})
