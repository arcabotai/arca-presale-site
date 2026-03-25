import { useState, useEffect, useMemo } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useSwitchChain, useWalletClient } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { base } from 'wagmi/chains'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { SwapWidget } from '@reservoir0x/relay-kit-ui'
import { adaptViemWallet } from '@reservoir0x/relay-sdk'
import { PRESALE_CONTRACT_ADDRESS, presaleAbi } from '../config/contract'

const NATIVE_ETH_BASE = {
  chainId: 8453,
  address: '0x0000000000000000000000000000000000000000',
  name: 'Ether',
  symbol: 'ETH',
  decimals: 18,
  logoURI: 'https://assets.relay.link/icons/1/light.png',
}

export default function Contribute() {
  const { address, isConnected, chain } = useAccount()
  const { switchChain } = useSwitchChain()
  const { data: walletClient } = useWalletClient()
  const [amount, setAmount] = useState('0.1')
  const [showSuccess, setShowSuccess] = useState(false)
  const [mode, setMode] = useState<'base' | 'crosschain'>('base')

  const isBase = chain?.id === base.id

  const adaptedWallet = useMemo(() => {
    if (!walletClient) return undefined
    return adaptViemWallet(walletClient)
  }, [walletClient])

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

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  })

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

  const quickAmounts = [0.01, 0.05, 0.1, 0.25, 0.5, 1]

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
                {/* OG Badge */}
                {isOG && (
                  <div className="og-badge-large">
                    <span className="og-star">&#9733;</span>
                    OG Wallet — 10% Bonus
                  </div>
                )}

                {/* Current contribution */}
                {currentContrib > 0 && (
                  <div className="contribution-info">
                    Your contribution: <span className="mono accent">{currentContrib.toFixed(4)} ETH</span>
                    {isOG && <span className="og-bonus-text"> (+10% bonus)</span>}
                  </div>
                )}

                {/* Amount input */}
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

                  {/* Slider */}
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

                  {/* Quick amounts */}
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

                  {/* Contribute button */}
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

                  {/* Error */}
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
          /* === MODE 2: Cross-chain via Relay === */
          <div className="crosschain-container">
            <div className="crosschain-note">
              Bridge any token from any chain directly to the presale contract on Base. Relay handles the swap + bridge in one transaction.
            </div>

            <div className="relay-widget-wrapper">
              <SwapWidget
                defaultToAddress={PRESALE_CONTRACT_ADDRESS}
                toToken={NATIVE_ETH_BASE}
                lockToToken={true}
                wallet={adaptedWallet}
                supportedWalletVMs={['evm']}
                onConnectWallet={() => {
                  document.querySelector<HTMLButtonElement>('[data-testid="rk-connect-button"]')?.click()
                }}
                onSwapSuccess={() => {
                  setShowSuccess(true)
                  setTimeout(() => setShowSuccess(false), 5000)
                }}
              />
            </div>

            <div className="crosschain-fee-warning">
              Cross-chain contributions may incur a 0.1–0.5% bridge fee. For zero fees, use the "Base ETH" tab.
            </div>
          </div>
        )}
      </div>

      {/* Success animation */}
      {showSuccess && (
        <div className="toast">
          Contribution confirmed! Thank you for supporting $ARCA.
        </div>
      )}
    </section>
  )
}
