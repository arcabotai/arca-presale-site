import { useState, useEffect } from 'react'
import { useAccount, useChainId, useReadContract, useWriteContract, useWaitForTransactionReceipt, useSendTransaction } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { PRESALE_CONTRACT_ADDRESS, presaleAbi } from '../config/contract'

const CHAIN_NAMES: Record<number, string> = {
  8453: 'Base', 1: 'Ethereum', 42161: 'Arbitrum', 10: 'Optimism',
  137: 'Polygon', 56: 'BSC', 43114: 'Avalanche', 324: 'zkSync',
}

function formatTokens(wei: bigint): string {
  const n = Number(wei) / 1e18
  if (n >= 1e9) return `~${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `~${(n / 1e6).toFixed(0)}M`
  return `~${n.toFixed(0)}`
}

export default function Contribute() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [amount, setAmount] = useState('')
  const [relayQuote, setRelayQuote] = useState<any>(null)
  const [quoteLoading, setQuoteLoading] = useState(false)

  const isOnBase = chainId === 8453
  const chainName = CHAIN_NAMES[chainId] || `Chain ${chainId}`

  // Contract reads
  const { data: currentMult } = useReadContract({
    address: PRESALE_CONTRACT_ADDRESS, abi: presaleAbi,
    functionName: 'currentMultiplier',
    query: { refetchInterval: 10_000 },
  })

  const { data: totalRaised } = useReadContract({
    address: PRESALE_CONTRACT_ADDRESS, abi: presaleAbi,
    functionName: 'totalRaised',
    query: { refetchInterval: 10_000 },
  })

  const { data: remaining } = useReadContract({
    address: PRESALE_CONTRACT_ADDRESS, abi: presaleAbi,
    functionName: 'remainingCapacity',
    query: { refetchInterval: 10_000 },
  })

  const { data: userContributed } = useReadContract({
    address: PRESALE_CONTRACT_ADDRESS, abi: presaleAbi,
    functionName: 'totalContributed',
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 10_000 },
  })

  const { data: isOG } = useReadContract({
    address: PRESALE_CONTRACT_ADDRESS, abi: presaleAbi,
    functionName: 'ogWhitelist',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  const { data: isActive } = useReadContract({
    address: PRESALE_CONTRACT_ADDRESS, abi: presaleAbi,
    functionName: 'isActive',
    query: { refetchInterval: 10_000 },
  })

  // Base ETH contribution
  const { writeContract, data: txHash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash })

  // Cross-chain via Relay
  const { sendTransaction, data: relayTxHash, isPending: relayPending } = useSendTransaction()
  const { isLoading: relayConfirming, isSuccess: relaySuccess } = useWaitForTransactionReceipt({ hash: relayTxHash })

  // Calculate estimate
  const amountNum = parseFloat(amount) || 0
  const multiplier = currentMult ? Number(currentMult) / 10000 : 1.5
  const effectiveWeight = amountNum * multiplier * (isOG ? 1.1 : 1)
  const totalRaisedEth = totalRaised ? Number(formatEther(totalRaised as bigint)) : 0
  const remainingEth = remaining ? Number(formatEther(remaining as bigint)) : 12.5
  const userContributedEth = userContributed ? Number(formatEther(userContributed as bigint)) : 0
  const maxForWallet = Math.min(1 - userContributedEth, remainingEth)

  // Fetch Relay quote for cross-chain
  useEffect(() => {
    if (isOnBase || !address || amountNum < 0.01) {
      setRelayQuote(null)
      return
    }
    const timer = setTimeout(async () => {
      setQuoteLoading(true)
      try {
        const res = await fetch('https://api.relay.link/quote/v2', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user: address,
            originChainId: chainId,
            destinationChainId: 8453,
            originCurrency: '0x0000000000000000000000000000000000000000',
            destinationCurrency: '0x0000000000000000000000000000000000000000',
            amount: parseEther(amount).toString(),
            tradeType: 'EXACT_INPUT',
          }),
        })
        const data = await res.json()
        if (data.steps) setRelayQuote(data)
        else setRelayQuote(null)
      } catch { setRelayQuote(null) }
      setQuoteLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [amount, chainId, address, isOnBase])

  function handleContribute() {
    if (!amount || amountNum < 0.01) return

    if (isOnBase) {
      writeContract({
        address: PRESALE_CONTRACT_ADDRESS,
        abi: presaleAbi,
        functionName: 'contribute',
        value: parseEther(amount),
      })
    } else if (relayQuote) {
      const step = relayQuote.steps?.[0]?.items?.[0]
      if (step?.data) {
        sendTransaction({
          to: step.data.to,
          value: BigInt(step.data.value || '0'),
          data: step.data.data,
        })
      }
    }
  }

  const isBusy = isPending || isConfirming || relayPending || relayConfirming
  const didSucceed = isSuccess || relaySuccess
  const quickAmounts = [0.01, 0.05, 0.1, 0.5, 1]

  // Receive amount for cross-chain
  const receiveAmount = relayQuote?.steps?.[0]?.items?.[0]?.data?.value
    ? Number(formatEther(BigInt(relayQuote.steps[0].items[0].data.value)))
    : amountNum

  if (!isConnected) {
    return (
      <section className="fade-up">
        <div className="section-label">Contribute</div>
        <h2>Join the presale</h2>
        <p className="section-desc">Connect your wallet to contribute from any chain.</p>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
          <ConnectButton />
        </div>
      </section>
    )
  }

  return (
    <section id="contribute" className="fade-up">
      <div className="section-label">Contribute</div>
      <h2>Get $ARCA</h2>

      <div className="contribute-card" style={{
        background: 'var(--surface, #111827)',
        border: '1px solid var(--border, #1f2937)',
        borderRadius: '16px',
        padding: '1.5rem',
        maxWidth: '480px',
        margin: '0 auto',
      }}>
        {/* Chain status */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          marginBottom: '1rem', fontSize: '0.85rem',
        }}>
          <span style={{
            display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
            background: isOnBase ? '#10b981' : '#f59e0b',
          }} />
          <span style={{ color: '#9ca3af' }}>
            {isOnBase ? `You're on Base — zero bridge fees ✓` : `You're on ${chainName} — bridge fee ~0.1%`}
          </span>
        </div>

        {/* OG badge */}
        {isOG && (
          <div style={{
            background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)',
            borderRadius: '8px', padding: '0.5rem 0.75rem', marginBottom: '1rem',
            fontSize: '0.8rem', color: '#fbbf24', textAlign: 'center',
          }}>
            ✦ OG Wallet — 10% bonus on your contribution
          </div>
        )}

        {/* Already contributed */}
        {userContributedEth > 0 && (
          <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.75rem' }}>
            You've contributed: {userContributedEth.toFixed(4)} ETH
          </div>
        )}

        {/* Amount input */}
        <div style={{ marginBottom: '0.75rem' }}>
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min={0.01}
            max={maxForWallet}
            step={0.01}
            style={{
              width: '100%', padding: '1rem', fontSize: '1.5rem', fontFamily: 'monospace',
              background: '#0a0f18', border: '1px solid #1f2937', borderRadius: '12px',
              color: '#f3f4f6', outline: 'none', textAlign: 'center',
            }}
          />
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginTop: '0.25rem', fontSize: '0.75rem', color: '#6b7280',
          }}>
            <span>Min: 0.01 ETH</span>
            <span>Max: {maxForWallet.toFixed(2)} ETH</span>
          </div>
        </div>

        {/* Quick amounts */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {quickAmounts.filter(a => a <= maxForWallet + 0.001).map((a) => (
            <button key={a} onClick={() => setAmount(a.toString())}
              style={{
                flex: 1, minWidth: '50px', padding: '0.4rem', fontSize: '0.8rem',
                fontFamily: 'monospace', background: '#1f2937', border: '1px solid #374151',
                borderRadius: '8px', color: '#e5e7eb', cursor: 'pointer',
              }}
            >
              {a} ETH
            </button>
          ))}
        </div>

        {/* Estimate card */}
        {amountNum >= 0.01 && (
          <div style={{
            background: '#0a0f18', border: '1px solid #1f2937', borderRadius: '10px',
            padding: '0.75rem', marginBottom: '1rem', fontSize: '0.85rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ color: '#6b7280' }}>Multiplier</span>
              <span style={{ color: '#fbbf24', fontWeight: 700, fontFamily: 'monospace' }}>{multiplier.toFixed(2)}×</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ color: '#6b7280' }}>Effective weight</span>
              <span style={{ color: '#e5e7eb', fontFamily: 'monospace' }}>{effectiveWeight.toFixed(4)} ETH</span>
            </div>
            {isOG && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ color: '#6b7280' }}>OG Bonus</span>
                <span style={{ color: '#10b981', fontFamily: 'monospace' }}>+10%</span>
              </div>
            )}
            {!isOnBase && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ color: '#6b7280' }}>Presale receives</span>
                <span style={{ color: '#e5e7eb', fontFamily: 'monospace' }}>
                  {quoteLoading ? '...' : `~${receiveAmount.toFixed(4)} ETH`}
                </span>
              </div>
            )}
            <div style={{ borderTop: '1px solid #1f2937', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Estimated $ARCA</span>
                <span style={{ color: '#fbbf24', fontWeight: 700, fontFamily: 'monospace', fontSize: '1rem' }}>
                  {formatTokens(BigInt(Math.floor(effectiveWeight * 1e18)))} tokens
                </span>
              </div>
              <p style={{ color: '#4b5563', fontSize: '0.7rem', marginTop: '0.25rem', lineHeight: 1.4 }}>
                Final allocation depends on total contributions at presale close
              </p>
            </div>
          </div>
        )}

        {/* Contribute button */}
        <button
          onClick={handleContribute}
          disabled={isBusy || amountNum < 0.01 || amountNum > maxForWallet || (!isOnBase && !relayQuote && !quoteLoading)}
          style={{
            width: '100%', padding: '1rem', fontSize: '1.1rem', fontWeight: 700,
            background: isBusy ? '#374151' : didSucceed ? '#10b981' : '#fbbf24',
            color: '#0a0a0a', border: 'none', borderRadius: '12px',
            cursor: isBusy ? 'wait' : 'pointer', fontFamily: 'sans-serif',
            opacity: (amountNum < 0.01 || amountNum > maxForWallet) ? 0.5 : 1,
          }}
        >
          {didSucceed
            ? '✓ Contribution confirmed!'
            : isBusy
              ? 'Processing...'
              : `Contribute ${amount || '0'} ETH`}
        </button>

        {/* Success message */}
        {didSucceed && (
          <div style={{
            marginTop: '0.75rem', padding: '0.75rem', background: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px',
            fontSize: '0.85rem', color: '#10b981', textAlign: 'center',
          }}>
            🎉 Welcome to $ARCA! Your multiplier has been locked at {multiplier.toFixed(2)}×
          </div>
        )}
      </div>
    </section>
  )
}
