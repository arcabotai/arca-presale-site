import { useCallback, useEffect, useState } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi'
import { formatEther } from 'viem'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { presaleAbi, PRESALE_CONTRACT_ADDRESS } from '../config/contract'

const BASE_CHAIN_ID = 8453

export default function RefundClaim() {
  const { address, isConnected, chain } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { switchChain } = useSwitchChain()
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

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
    setToast({ message: 'Refund claimed successfully! ETH is on its way.', type: 'success' })
    refetchContribution()
    reset()
  }, [refetchContribution, reset])

  useEffect(() => {
    if (isSuccess) handleSuccess()
  }, [isSuccess, handleSuccess])

  useEffect(() => {
    if (writeError) {
      const msg = writeError.message.includes('User rejected')
        ? 'Transaction rejected.'
        : 'Transaction failed. Please try again.'
      setToast({ message: msg, type: 'error' })
    }
  }, [writeError])

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const handleRefund = () => {
    writeContract({
      address: PRESALE_CONTRACT_ADDRESS,
      abi: presaleAbi,
      functionName: 'refund',
    })
  }

  /* ── Not connected ── */
  if (!isConnected) {
    return (
      <div className="wallet-box">
        <div className="wallet-label">Claim Refund</div>
        <p className="wallet-note" style={{ marginBottom: '1.25rem' }}>
          Connect your wallet to check if you have a refund available.
        </p>
        <button className="btn-primary" onClick={openConnectModal} type="button">
          Connect Wallet to Check Refund
        </button>
      </div>
    )
  }

  /* ── Wrong network ── */
  if (!isBase) {
    return (
      <div className="wallet-box">
        <div className="wallet-label">Wrong Network</div>
        <p className="wallet-note" style={{ marginBottom: '1rem' }}>
          Switch to Base to claim your refund.
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

  const actualContribution = contribution?.[0] ?? 0n
  const hasContribution = actualContribution > 0n

  /* ── No contribution ── */
  if (!hasContribution) {
    return (
      <div className="wallet-box">
        <div className="wallet-label">Claim Refund</div>
        <div className="refund-none">
          <span className="refund-none-icon">○</span>
          <p>No contribution found for this wallet.</p>
          <p className="wallet-note" style={{ marginTop: '0.5rem' }}>
            If you contributed from a different address, switch wallets and try again.
          </p>
        </div>
      </div>
    )
  }

  /* ── Has contribution ── */
  const ethAmount = formatEther(actualContribution)

  return (
    <div className="wallet-box">
      <div className="wallet-label">Claim Refund</div>

      <div className="refund-amount-display">
        <div className="refund-amount-value">{parseFloat(ethAmount).toFixed(4)}</div>
        <div className="refund-amount-unit">ETH</div>
      </div>

      <p className="wallet-note" style={{ marginBottom: '1.5rem' }}>
        Your full contribution is available for refund. No fees, no deductions.
      </p>

      <button
        className="btn-primary deposit-btn-full"
        onClick={handleRefund}
        disabled={isPending || isConfirming}
        type="button"
      >
        {isPending
          ? 'Confirm in Wallet...'
          : isConfirming
          ? 'Processing Refund...'
          : `Claim Refund — ${parseFloat(ethAmount).toFixed(4)} ETH`}
      </button>

      {toast && (
        <div className={`toast ${toast.type === 'error' ? 'toast-error' : ''}`}>
          {toast.message}
        </div>
      )}
    </div>
  )
}
