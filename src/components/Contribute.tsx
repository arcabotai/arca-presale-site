import { useState, useEffect, useRef, useCallback } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useSwitchChain, useSendTransaction } from 'wagmi'
import { parseEther, formatEther, parseUnits, formatUnits, type Hex } from 'viem'
import { base } from 'wagmi/chains'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { PRESALE_CONTRACT_ADDRESS, presaleAbi } from '../config/contract'

// ─── Chain & token data (hardcoded) ───
interface Token {
  symbol: string
  address: string
  decimals: number
}
interface Chain {
  id: number
  name: string
  icon: string
  tokens: Token[]
}

const CHAINS: Chain[] = [
  { id: 8453, name: 'Base', icon: '🔵', tokens: [{ symbol: 'ETH', address: '0x0000000000000000000000000000000000000000', decimals: 18 }, { symbol: 'USDC', address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', decimals: 6 }] },
  { id: 1, name: 'Ethereum', icon: '⟠', tokens: [{ symbol: 'ETH', address: '0x0000000000000000000000000000000000000000', decimals: 18 }, { symbol: 'USDC', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6 }, { symbol: 'USDT', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6 }, { symbol: 'WETH', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', decimals: 18 }] },
  { id: 42161, name: 'Arbitrum', icon: '🔷', tokens: [{ symbol: 'ETH', address: '0x0000000000000000000000000000000000000000', decimals: 18 }, { symbol: 'USDC', address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', decimals: 6 }, { symbol: 'ARB', address: '0x912CE59144191C1204E64559FE8253a0e49E6548', decimals: 18 }] },
  { id: 10, name: 'Optimism', icon: '🔴', tokens: [{ symbol: 'ETH', address: '0x0000000000000000000000000000000000000000', decimals: 18 }, { symbol: 'USDC', address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', decimals: 6 }, { symbol: 'OP', address: '0x4200000000000000000000000000000000000042', decimals: 18 }] },
  { id: 137, name: 'Polygon', icon: '🟣', tokens: [{ symbol: 'MATIC', address: '0x0000000000000000000000000000000000000000', decimals: 18 }, { symbol: 'USDC', address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', decimals: 6 }] },
  { id: 56, name: 'BSC', icon: '🟡', tokens: [{ symbol: 'BNB', address: '0x0000000000000000000000000000000000000000', decimals: 18 }, { symbol: 'USDC', address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', decimals: 18 }] },
]

const NATIVE_ZERO = '0x0000000000000000000000000000000000000000'

interface RelayQuote {
  steps: Array<{
    items: Array<{
      data: {
        to: string
        value: string
        data: string
        chainId: number
      }
    }>
  }>
  details: {
    currencyIn: { amount: string; amountFormatted: string; currency: { symbol: string } }
    currencyOut: { amount: string; amountFormatted: string; currency: { symbol: string } }
    totalFees: { relayer: { amountFormatted: string } }
  }
}

export default function Contribute() {
  const { address, isConnected, chain } = useAccount()
  const { switchChain } = useSwitchChain()
  const [amount, setAmount] = useState('0.1')
  const [showSuccess, setShowSuccess] = useState(false)

  // Cross-chain state
  const [selectedChainId, setSelectedChainId] = useState<number>(1)
  const [selectedTokenIdx, setSelectedTokenIdx] = useState(0)
  const [crossAmount, setCrossAmount] = useState('')
  const [quote, setQuote] = useState<RelayQuote | null>(null)
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [quoteError, setQuoteError] = useState('')
  const [crossTxPending, setCrossTxPending] = useState(false)
  const [crossTxHash, setCrossTxHash] = useState<string | null>(null)
  const [chainDropdownOpen, setChainDropdownOpen] = useState(false)
  const [tokenDropdownOpen, setTokenDropdownOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Auto-detect connected chain → set default tab + chain selector
  const isBase = chain?.id === base.id
  const [mode, setMode] = useState<'base' | 'crosschain'>('base')

  useEffect(() => {
    if (!chain) return
    if (chain.id === base.id) {
      setMode('base')
    } else {
      setMode('crosschain')
      const match = CHAINS.find(c => c.id === chain.id)
      if (match) {
        setSelectedChainId(match.id)
        setSelectedTokenIdx(0)
      }
    }
  }, [chain])

  const selectedChain = CHAINS.find(c => c.id === selectedChainId) || CHAINS[0]
  const selectedToken = selectedChain.tokens[selectedTokenIdx] || selectedChain.tokens[0]

  // ─── Base ETH contract reads ───
  const { data: isActive } = useReadContract({
    address: PRESALE_CONTRACT_ADDRESS,
    abi: presaleAbi,
    functionName: 'isActive',
    query: { refetchInterval: 10_000 },
  })

  const { data: remainingCapacity } = useReadContract({
    address: PRESALE_CONTRACT_ADDRESS,
    abi: presaleAbi,
    functionName: 'remainingCapacity',
    query: { refetchInterval: 10_000 },
  })

  const { data: currentContribution } = useReadContract({
    address: PRESALE_CONTRACT_ADDRESS,
    abi: presaleAbi,
    functionName: 'contributions',
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 10_000 },
  })

  const { data: isOG } = useReadContract({
    address: PRESALE_CONTRACT_ADDRESS,
    abi: presaleAbi,
    functionName: 'ogWhitelist',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  const { writeContract, data: txHash, isPending, error: writeError, reset } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash })

  // Cross-chain tx
  const { sendTransaction, isPending: isSendPending } = useSendTransaction()

  useEffect(() => {
    if (isSuccess) {
      setShowSuccess(true)
      const timer = setTimeout(() => setShowSuccess(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [isSuccess])

  const maxRemaining = remainingCapacity ? Number(formatEther(remainingCapacity)) : 12.5
  const currentContrib = currentContribution ? Number(formatEther(currentContribution)) : 0
  const maxForWallet = Math.min(1 - currentContrib, maxRemaining)
  const amountNum = Number(amount) || 0

  const handleContribute = () => {
    if (amountNum < 0.01 || amountNum > maxForWallet) return
    reset()
    writeContract({
      address: PRESALE_CONTRACT_ADDRESS,
      abi: presaleAbi,
      functionName: 'contribute',
      value: parseEther(amount),
    })
  }

  // ─── Relay quote fetching (debounced) ───
  const fetchQuote = useCallback(async (amt: string) => {
    if (!address || !amt || Number(amt) <= 0) {
      setQuote(null)
      return
    }

    setQuoteLoading(true)
    setQuoteError('')
    setQuote(null)

    try {
      const amountWei = parseUnits(amt, selectedToken.decimals).toString()
      const res = await fetch('https://api.relay.link/quote/v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: address,
          originChainId: selectedChainId,
          destinationChainId: 8453,
          originCurrency: selectedToken.address,
          destinationCurrency: NATIVE_ZERO,
          amount: amountWei,
          tradeType: 'EXACT_INPUT',
        }),
      })

      if (!res.ok) {
        const errBody = await res.text()
        throw new Error(errBody || `Quote failed (${res.status})`)
      }

      const data: RelayQuote = await res.json()
      setQuote(data)
    } catch (err: any) {
      setQuoteError(err.message?.slice(0, 120) || 'Failed to fetch quote')
    } finally {
      setQuoteLoading(false)
    }
  }, [address, selectedChainId, selectedToken])

  // Debounce cross-chain amount changes
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!crossAmount || Number(crossAmount) <= 0) {
      setQuote(null)
      return
    }
    debounceRef.current = setTimeout(() => {
      fetchQuote(crossAmount)
    }, 500)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [crossAmount, fetchQuote])

  // Reset token selection when chain changes
  useEffect(() => {
    setSelectedTokenIdx(0)
    setQuote(null)
    setQuoteError('')
  }, [selectedChainId])

  // ─── Cross-chain contribute ───
  const handleCrossContribute = async () => {
    if (!quote || !quote.steps?.[0]?.items?.[0]?.data) return

    const txData = quote.steps[0].items[0].data

    // If user is on a different chain than selected, prompt switch
    if (chain?.id !== selectedChainId) {
      switchChain({ chainId: selectedChainId })
      return
    }

    setCrossTxPending(true)
    setCrossTxHash(null)

    try {
      sendTransaction(
        {
          to: txData.to as Hex,
          value: BigInt(txData.value || '0'),
          data: txData.data as Hex,
          chainId: txData.chainId,
        },
        {
          onSuccess: (hash) => {
            setCrossTxHash(hash)
            setCrossTxPending(false)
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 5000)
          },
          onError: () => {
            setCrossTxPending(false)
          },
        },
      )
    } catch {
      setCrossTxPending(false)
    }
  }

  const quickAmounts = [0.01, 0.05, 0.1, 0.25, 0.5, 1]

  // Close dropdowns on outside click
  const chainDropdownRef = useRef<HTMLDivElement>(null)
  const tokenDropdownRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (chainDropdownRef.current && !chainDropdownRef.current.contains(e.target as Node)) setChainDropdownOpen(false)
      if (tokenDropdownRef.current && !tokenDropdownRef.current.contains(e.target as Node)) setTokenDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <section id="contribute" className="contribute-section">
      <div className="section-label">Contribute</div>
      <h2>Join the $ARCA Presale</h2>
      <p className="section-desc">
        Connect your wallet and contribute ETH on Base. Min 0.01 ETH, max 1 ETH per wallet.
        {isOG && ' You\'re an OG — 10% bonus on your contribution!'}
      </p>

      {/* Mode tabs */}
      <div className="contribute-tabs">
        <button
          className={`contribute-tab ${mode === 'base' ? 'active' : ''}`}
          onClick={() => setMode('base')}
        >
          Base ETH
          <span className="tab-badge">No fees</span>
        </button>
        <button
          className={`contribute-tab ${mode === 'crosschain' ? 'active' : ''}`}
          onClick={() => setMode('crosschain')}
        >
          Any Chain
        </button>
      </div>

      <div className="wallet-box">
        {mode === 'base' ? (
          /* === MODE 1: Direct ETH on Base === */
          <>
            {!isConnected ? (
              <div className="connect-prompt">
                <div className="wallet-label">Connect Your Wallet</div>
                <p className="wallet-note">Connect to Base to contribute to the presale</p>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                  <ConnectButton />
                </div>
              </div>
            ) : !isBase ? (
              <div className="connect-prompt">
                <div className="wallet-label">Wrong Network</div>
                <p className="wallet-note">Please switch to Base to contribute</p>
                <button className="switch-chain-btn" onClick={() => switchChain({ chainId: base.id })}>
                  Switch to Base
                </button>
              </div>
            ) : (
              <>
                {isOG && (
                  <div className="og-badge-large">
                    <span className="og-star">&#9733;</span>
                    OG Wallet — 10% Bonus
                  </div>
                )}

                {currentContrib > 0 && (
                  <div className="contribution-info">
                    Your contribution: <span className="mono accent">{currentContrib.toFixed(4)} ETH</span>
                    {isOG && <span className="og-bonus-text"> (+10% bonus)</span>}
                  </div>
                )}

                <div className="deposit-form-v2">
                  <div className="deposit-amount-display">
                    <input
                      type="number"
                      className="eth-input-large"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min={0.01}
                      max={maxForWallet}
                      step={0.01}
                      disabled={!isActive || isPending || isConfirming}
                    />
                    <span className="eth-suffix">ETH</span>
                  </div>

                  <div className="slider-container">
                    <input
                      type="range"
                      className="eth-slider"
                      min={0.01}
                      max={Math.max(maxForWallet, 0.01)}
                      step={0.01}
                      value={amountNum}
                      onChange={(e) => setAmount(e.target.value)}
                      disabled={!isActive || isPending || isConfirming}
                    />
                    <div className="slider-labels">
                      <span>0.01 ETH</span>
                      <span>{maxForWallet.toFixed(2)} ETH max</span>
                    </div>
                  </div>

                  <div className="quick-amounts">
                    {quickAmounts
                      .filter((v) => v <= maxForWallet)
                      .map((v) => (
                        <button
                          key={v}
                          className={`quick-btn ${amountNum === v ? 'active' : ''}`}
                          onClick={() => setAmount(String(v))}
                          disabled={!isActive || isPending || isConfirming}
                        >
                          {v} ETH
                        </button>
                      ))}
                  </div>

                  <button
                    className="btn-primary deposit-btn-full"
                    onClick={handleContribute}
                    disabled={
                      !isActive ||
                      isPending ||
                      isConfirming ||
                      amountNum < 0.01 ||
                      amountNum > maxForWallet
                    }
                  >
                    {isPending
                      ? 'Confirm in Wallet...'
                      : isConfirming
                        ? 'Confirming...'
                        : `Contribute ${amount} ETH`}
                  </button>

                  {writeError && (
                    <div className="tx-error">
                      {writeError.message.includes('User rejected')
                        ? 'Transaction rejected'
                        : writeError.message.slice(0, 100)}
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        ) : (
          /* === MODE 2: Custom Cross-chain via Relay API === */
          <div className="crosschain-container">
            {!isConnected ? (
              <div className="connect-prompt">
                <div className="wallet-label">Connect Your Wallet</div>
                <p className="wallet-note">Connect your wallet to contribute from any chain</p>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                  <ConnectButton />
                </div>
              </div>
            ) : (
              <>
                <div className="crosschain-note">
                  Contribute from any chain. Relay bridges your tokens to ETH on Base in one transaction.
                </div>

                {/* Chain + Token selectors */}
                <div className="cross-selectors">
                  {/* Chain dropdown */}
                  <div className="cross-dropdown" ref={chainDropdownRef}>
                    <label className="cross-label">Chain</label>
                    <button
                      className="cross-select-btn"
                      onClick={() => { setChainDropdownOpen(!chainDropdownOpen); setTokenDropdownOpen(false) }}
                    >
                      <span className="cross-select-icon">{selectedChain.icon}</span>
                      <span className="cross-select-name">{selectedChain.name}</span>
                      <span className="cross-select-arrow">{chainDropdownOpen ? '▲' : '▼'}</span>
                    </button>
                    {chainDropdownOpen && (
                      <div className="cross-dropdown-menu">
                        {CHAINS.filter(c => c.id !== 8453).map(c => (
                          <button
                            key={c.id}
                            className={`cross-dropdown-item ${c.id === selectedChainId ? 'active' : ''}`}
                            onClick={() => {
                              setSelectedChainId(c.id)
                              setChainDropdownOpen(false)
                            }}
                          >
                            <span className="cross-select-icon">{c.icon}</span>
                            <span>{c.name}</span>
                            {c.id === chain?.id && <span className="cross-connected-badge">Connected</span>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Token dropdown */}
                  <div className="cross-dropdown" ref={tokenDropdownRef}>
                    <label className="cross-label">Token</label>
                    <button
                      className="cross-select-btn"
                      onClick={() => { setTokenDropdownOpen(!tokenDropdownOpen); setChainDropdownOpen(false) }}
                    >
                      <span className="cross-select-name">{selectedToken.symbol}</span>
                      <span className="cross-select-arrow">{tokenDropdownOpen ? '▲' : '▼'}</span>
                    </button>
                    {tokenDropdownOpen && (
                      <div className="cross-dropdown-menu">
                        {selectedChain.tokens.map((t, i) => (
                          <button
                            key={t.symbol}
                            className={`cross-dropdown-item ${i === selectedTokenIdx ? 'active' : ''}`}
                            onClick={() => {
                              setSelectedTokenIdx(i)
                              setTokenDropdownOpen(false)
                            }}
                          >
                            <span>{t.symbol}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Amount input */}
                <div className="deposit-form-v2">
                  <div className="deposit-amount-display">
                    <input
                      type="number"
                      className="eth-input-large"
                      value={crossAmount}
                      onChange={(e) => setCrossAmount(e.target.value)}
                      placeholder="0.0"
                      min={0}
                      step="any"
                      disabled={crossTxPending}
                    />
                    <span className="eth-suffix">{selectedToken.symbol}</span>
                  </div>

                  {/* Quote display */}
                  {quoteLoading && (
                    <div className="cross-quote-box">
                      <span className="cross-quote-loading">Fetching quote...</span>
                    </div>
                  )}

                  {quoteError && (
                    <div className="tx-error">{quoteError}</div>
                  )}

                  {quote && !quoteLoading && (
                    <div className="cross-quote-box">
                      <div className="cross-quote-row">
                        <span className="cross-quote-label">You send</span>
                        <span className="cross-quote-value">
                          {quote.details.currencyIn.amountFormatted} {quote.details.currencyIn.currency.symbol} on {selectedChain.name}
                        </span>
                      </div>
                      <div className="cross-quote-arrow-row">→</div>
                      <div className="cross-quote-row">
                        <span className="cross-quote-label">Presale receives</span>
                        <span className="cross-quote-value accent">
                          ~{Number(quote.details.currencyOut.amountFormatted).toFixed(6)} ETH on Base
                        </span>
                      </div>
                      {quote.details.totalFees?.relayer && (
                        <div className="cross-quote-fee">
                          Bridge fee: ~{quote.details.totalFees.relayer.amountFormatted}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Switch chain prompt if needed */}
                  {chain?.id !== selectedChainId && quote && (
                    <div className="cross-switch-notice">
                      You're on {chain?.name || 'unknown'}. Click below to switch to {selectedChain.name} and contribute.
                    </div>
                  )}

                  {/* Contribute button */}
                  <button
                    className="btn-primary deposit-btn-full"
                    onClick={handleCrossContribute}
                    disabled={!quote || quoteLoading || crossTxPending || isSendPending}
                  >
                    {crossTxPending || isSendPending
                      ? 'Confirm in Wallet...'
                      : crossTxHash
                        ? 'Submitted!'
                        : chain?.id !== selectedChainId
                          ? `Switch to ${selectedChain.name}`
                          : `Contribute via ${selectedChain.name}`}
                  </button>
                </div>

                <div className="crosschain-fee-warning">
                  Cross-chain: ~0.1–0.5% bridge fee. Base ETH: zero fees.
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {showSuccess && (
        <div className="toast">
          Contribution confirmed! Thank you for supporting $ARCA.
        </div>
      )}
    </section>
  )
}
