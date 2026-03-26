export const PRESALE_CONTRACT_ADDRESS = '0x4D4A204bE71776CaF11712D92C69e7F665cB86Fe' as const

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
    name: 'isStarted',
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
    name: 'startTime',
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
    name: 'remainingCapacity',
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
      { name: '', type: 'address[]', internalType: 'address[]' },
      { name: '', type: 'uint256[]', internalType: 'uint256[]' },
      { name: '', type: 'uint256[]', internalType: 'uint256[]' },
      { name: '', type: 'bool[]', internalType: 'bool[]' },
    ],
    stateMutability: 'view',
  },

  // === EVENTS ===
  {
    type: 'event',
    name: 'Contributed',
    inputs: [
      { name: 'contributor', type: 'address', indexed: true, internalType: 'address' },
      { name: 'amount', type: 'uint256', indexed: false, internalType: 'uint256' },
      { name: 'timestamp', type: 'uint256', indexed: false, internalType: 'uint256' },
      { name: 'isOG', type: 'bool', indexed: false, internalType: 'bool' },
    ],
    anonymous: false,
  },

  // === V3 READ FUNCTIONS ===
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
      { name: 'nextThreshold', type: 'uint256', internalType: 'uint256' },
      { name: 'nextMultiplier', type: 'uint256', internalType: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getContributionDetails',
    inputs: [{ name: 'contributor', type: 'address', internalType: 'address' }],
    outputs: [
      { name: 'amount', type: 'uint256', internalType: 'uint256' },
      { name: 'effectiveAmount', type: 'uint256', internalType: 'uint256' },
      { name: 'isOG', type: 'bool', internalType: 'bool' },
    ],
    stateMutability: 'view',
  },

  {
    type: 'function',
    name: 'totalContributed',
    inputs: [{ name: '', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },

  // === ERRORS ===
  { type: 'error', name: 'PresaleNotActive', inputs: [] },
  { type: 'error', name: 'BelowMinimum', inputs: [] },
  { type: 'error', name: 'AboveMaximum', inputs: [] },
  { type: 'error', name: 'HardCapExceeded', inputs: [] },
  { type: 'error', name: 'NotStarted', inputs: [] },
] as const
