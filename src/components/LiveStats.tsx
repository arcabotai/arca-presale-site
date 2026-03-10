import { useState, useEffect } from 'react'
import { useReadContract } from 'wagmi'
import { formatEther } from 'viem'
import { presaleAbi, PRESALE_CONTRACT_ADDRESS, HARD_CAP_ETH, SOFT_CAP_ETH } from '../config/contract'

export default function LiveStats() {
  const { data: presaleInfo } = useReadContract({
    address: PRESALE_CONTRACT_ADDRESS,
    abi: presaleAbi,
    functionName: 'getPresaleInfo',
    query: { refetchInterval: 10000 },
  })

  const [timeLeft, setTimeLeft] = useState(0)
  const [lastSync, setLastSync] = useState(0)
  const [syncedRemaining, setSyncedRemaining] = useState(0)

  // Sync from contract data
  useEffect(() => {
    if (presaleInfo) {
      const remaining = Number(presaleInfo[4])
      setSyncedRemaining(remaining)
      setLastSync(Date.now())
      setTimeLeft(remaining)
    }
  }, [presaleInfo])

  // Tick countdown every second
  useEffect(() => {
    if (syncedRemaining <= 0) return
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - lastSync) / 1000)
      setTimeLeft(Math.max(0, syncedRemaining - elapsed))
    }, 1000)
    return () => clearInterval(interval)
  }, [syncedRemaining, lastSync])

  const hours = Math.floor(timeLeft / 3600)
  const minutes = Math.floor((timeLeft % 3600) / 60)
  const seconds = timeLeft % 60
  const countdown = presaleInfo
    ? timeLeft > 0
      ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      : 'Presale Ended'
    : '--:--:--'

  const totalRaised = presaleInfo ? Number(formatEther(presaleInfo[0])) : 0
  const contributorCount = presaleInfo ? Number(presaleInfo[3]) : 0
  const isEarlyBird = presaleInfo ? presaleInfo[6] : false
  const isActive = presaleInfo ? presaleInfo[5] : false

  const progressPercent = Math.min((totalRaised / HARD_CAP_ETH) * 100, 100)
  const softCapPercent = (SOFT_CAP_ETH / HARD_CAP_ETH) * 100

  return (
    <div className="live-stats">
      <div className="live-stats-header">
        <span className="section-label" style={{ marginBottom: 0 }}>Live Stats</span>
        {isEarlyBird && <span className="early-bird-badge">Early Bird Active (+10%)</span>}
        {isActive && <span className="presale-active-badge">Active</span>}
      </div>

      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          <div className="soft-cap-marker" style={{ left: `${softCapPercent}%` }}>
            <span>Soft Cap</span>
          </div>
        </div>
        <div className="progress-labels">
          <span>{totalRaised.toFixed(2)} ETH raised</span>
          <span>{HARD_CAP_ETH} ETH hard cap</span>
        </div>
      </div>

      <div className="live-stats-grid">
        <div className="live-stat">
          <div className="stat-value accent">{contributorCount}</div>
          <div className="stat-label">Contributors</div>
        </div>
        <div className="live-stat">
          <div className="stat-value">{totalRaised.toFixed(4)}</div>
          <div className="stat-label">ETH Raised</div>
        </div>
        <div className="live-stat">
          <div className="stat-value accent">{countdown}</div>
          <div className="stat-label">{timeLeft > 0 || !presaleInfo ? 'Time Remaining' : 'Status'}</div>
        </div>
      </div>
    </div>
  )
}
