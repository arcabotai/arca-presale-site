import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { base, mainnet } from 'wagmi/chains'

const projectId = '267a604b2a6d3def9a69504ea62b1280'

export const config = getDefaultConfig({
  appName: '$ARCA Presale',
  projectId,
  chains: [base, mainnet],
})
