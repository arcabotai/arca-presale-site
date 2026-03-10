import { useState, useEffect, useCallback } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { presaleAbi, PRESALE_CONTRACT_ADDRESS } from '../config/contract'

const BASE_CHAIN_ID = 8453

export default function PresaleDeposit() {
  const { address, isConnected, chain } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { switchChain } = useSwitchChain()
  const [amount, setAmount] = useState('0.1')
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

  const handleDeposit = () => {
    const ethAmount = parseFloat(amount)
    if (isNaN(ethAmount) || ethAmount < 0.01 || ethAmount > 1) return

    writeContract({
      address: PRESALE_CONTRACT_ADDRESS,
      abi: presaleAbi,
      functionName: 'deposit',
      value: parseEther(amount),
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

      <div className="deposit-form">
        <div className="deposit-input-group">
          <label htmlFor="eth-amount">Amount (ETH)</label>
          <input
            id="eth-amount"
            type="number"
            min="0.01"
            max="1"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="eth-input"
            disabled={isPending || isConfirming}
          />
        </div>
        <button
          className="btn-primary"
          onClick={handleDeposit}
          disabled={isPending || isConfirming}
          type="button"
        >
          {isPending ? 'Confirm in Wallet...' : isConfirming ? 'Confirming...' : 'Deposit'}
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
