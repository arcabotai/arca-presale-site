// V3 on Base Sepolia (testnet) — switch to mainnet address before launch
export const PRESALE_CONTRACT_ADDRESS = '0xDb19437d3fBC5eb8F16b2c42144516C5aBE45158' as const

export const VAULT_ADDRESS = '0x9a0756d4e1b2361d25d99701e1b8ab87ec262692' as const

export const HARD_CAP_ETH = 12.5
export const SOFT_CAP_ETH = 5

export const presaleAbi = [
  // === WRITE FUNCTIONS ===
  {
    type: 'function',
    name: 'contribute',
    inputs: [],
    outputs: [],
    stateMutability: 'payable',
  },

  // === READ FUNCTIONS ===
  {
    type: 'function',
    name: 'isActive',
    inputs: [],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'totalRaised',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'softCap',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'hardCap',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'softCapReachedAt',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'hardCapDeadline',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'timeRemaining',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'contributions',
    inputs: [{ name: '', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'effectiveWeights',
    inputs: [{ name: '', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'ogWhitelist',
    inputs: [{ name: '', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getContributorCount',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getAllContributions',
    inputs: [],
    outputs: [
      { name: 'wallets', type: 'address[]', internalType: 'address[]' },
      { name: 'amounts', type: 'uint256[]', internalType: 'uint256[]' },
      { name: 'weights', type: 'uint256[]', internalType: 'uint256[]' },
      { name: 'isOGList', type: 'bool[]', internalType: 'bool[]' },
    ],
    stateMutability: 'view',
  },

  // === V3 BONDING CURVE ===
  {
    type: 'function',
    name: 'currentMultiplier',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'currentPriceInfo',
    inputs: [],
    outputs: [
      { name: 'multiplier', type: 'uint256', internalType: 'uint256' },
      { name: 'raised', type: 'uint256', internalType: 'uint256' },
      { name: 'cap', type: 'uint256', internalType: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getEffectiveAmount',
    inputs: [{ name: 'contribution', type: 'uint256', internalType: 'uint256' }],
    outputs: [{ name: 'effectiveAmount', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getAllocationWeight',
    inputs: [{ name: 'wallet', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getContribution',
    inputs: [{ name: 'wallet', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isOG',
    inputs: [{ name: 'wallet', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'presaleClosed',
    inputs: [],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },

  // === EVENTS ===
  {
    type: 'event',
    name: 'Contributed',
    inputs: [
      { name: 'contributor', type: 'address', indexed: true, internalType: 'address' },
      { name: 'amount', type: 'uint256', indexed: false, internalType: 'uint256' },
      { name: 'totalContribution', type: 'uint256', indexed: false, internalType: 'uint256' },
      { name: 'multiplier', type: 'uint256', indexed: false, internalType: 'uint256' },
      { name: 'effectiveWeight', type: 'uint256', indexed: false, internalType: 'uint256' },
      { name: 'isOG', type: 'bool', indexed: false, internalType: 'bool' },
    ],
    anonymous: false,
  },

  // === ERRORS ===
  { type: 'error', name: 'PresaleNotActive', inputs: [] },
  { type: 'error', name: 'BelowMinimum', inputs: [] },
  { type: 'error', name: 'AboveMaximum', inputs: [] },
  { type: 'error', name: 'HardCapExceeded', inputs: [] },
] as const
