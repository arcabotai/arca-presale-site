import { useState, useEffect, useCallback } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { presaleAbi, PRESALE_CONTRACT_ADDRESS } from '../config/contract'

const BASE_CHAIN_ID = 8453
const MIN_ETH = 0.01
const MAX_ETH = 1
const DEFAULT_ETH = 0.5
const SLIDER_STEP = 0.01

export default function PresaleDeposit() {
  const { address, isConnected, chain } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { switchChain } = useSwitchChain()
  const [amount, setAmount] = useState(DEFAULT_ETH.toString())
  const [toast, setToast] = useState<string | null>(null)

  const isBase = chain?.id === BASE_CHAIN_ID

  const { data: contribution, refetch: refetchContribution } = useReadContract({
    address: PRESALE_CONTRACT_ADDRESS,
    abi: presaleAbi,
    functionName: 'getContribution',
    args: [address!],
    query: { enabled: isConnected && isBase && !!address },
  })

  const {
    writeContract,
    data: txHash,
    isPending,
    error: writeError,
    reset,
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  const handleSuccess = useCallback(() => {
    setToast('Deposit successful!')
    refetchContribution()
    reset()
  }, [refetchContribution, reset])

  useEffect(() => {
    if (isSuccess) {
      handleSuccess()
    }
  }, [isSuccess, handleSuccess])

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    setAmount(val.toFixed(2))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setAmount(raw)
  }

  const handleInputBlur = () => {
    let val = parseFloat(amount)
    if (isNaN(val)) val = DEFAULT_ETH
    val = Math.max(MIN_ETH, Math.min(MAX_ETH, val))
    setAmount(val.toFixed(2))
  }

  const handleDeposit = () => {
    const ethAmount = parseFloat(amount)
    if (isNaN(ethAmount) || ethAmount < MIN_ETH || ethAmount > MAX_ETH) return

    writeContract({
      address: PRESALE_CONTRACT_ADDRESS,
      abi: presaleAbi,
      functionName: 'deposit',
      value: parseEther(parseFloat(amount).toFixed(18)),
    })
  }

  if (!isConnected) {
    return (
      <div className="wallet-box">
        <div className="wallet-label">Presale Deposit</div>
        <button className="btn-primary" onClick={openConnectModal} type="button">
          Connect Wallet to Deposit
        </button>
      </div>
    )
  }

  if (!isBase) {
    return (
      <div className="wallet-box">
        <div className="wallet-label">Wrong Network</div>
        <p className="wallet-note" style={{ marginBottom: '1rem' }}>
          Please switch to Base to participate in the presale.
        </p>
        <button
          className="switch-chain-btn"
          onClick={() => switchChain({ chainId: BASE_CHAIN_ID })}
          type="button"
        >
          Switch to Base
        </button>
      </div>
    )
  }

  return (
    <div className="wallet-box">
      <div className="wallet-label">Presale Deposit</div>

      {contribution && contribution[0] > 0n && (
        <div className="contribution-info">
          <span>Your contribution: </span>
          <span className="mono accent">{formatEther(contribution[0])} ETH</span>
          {contribution[1] > contribution[0] && (
            <span className="early-bird-bonus">
              (Effective: {formatEther(contribution[1])} ETH with bonus)
            </span>
          )}
        </div>
      )}

      <div className="deposit-form-v2">
        <div className="deposit-amount-display">
          <input
            id="eth-amount"
            type="number"
            min={MIN_ETH}
            max={MAX_ETH}
            step={SLIDER_STEP}
            value={amount}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className="eth-input-large"
            disabled={isPending || isConfirming}
          />
          <span className="eth-suffix">ETH</span>
        </div>

        <div className="slider-container">
          <input
            type="range"
            min={MIN_ETH}
            max={MAX_ETH}
            step={SLIDER_STEP}
            value={parseFloat(amount) || DEFAULT_ETH}
            onChange={handleSliderChange}
            className="eth-slider"
            disabled={isPending || isConfirming}
          />
          <div className="slider-labels">
            <span>{MIN_ETH} ETH</span>
            <span>{MAX_ETH} ETH</span>
          </div>
        </div>

        <div className="quick-amounts">
          {[0.05, 0.1, 0.25, 0.5, 1].map((val) => (
            <button
              key={val}
              className={`quick-btn ${parseFloat(amount) === val ? 'active' : ''}`}
              onClick={() => setAmount(val.toFixed(2))}
              disabled={isPending || isConfirming}
              type="button"
            >
              {val} ETH
            </button>
          ))}
        </div>

        <button
          className="btn-primary deposit-btn-full"
          onClick={handleDeposit}
          disabled={isPending || isConfirming}
          type="button"
        >
          {isPending ? 'Confirm in Wallet...' : isConfirming ? 'Confirming...' : `Deposit ${amount} ETH`}
        </button>
      </div>

      {writeError && (
        <div className="tx-error">
          {writeError.message.includes('User rejected')
            ? 'Transaction rejected'
            : 'Transaction failed. Please try again.'}
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
