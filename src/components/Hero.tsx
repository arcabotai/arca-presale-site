import { useState, useEffect } from 'react'
import { useReadContract } from 'wagmi'
import { formatEther } from 'viem'
import { PRESALE_CONTRACT_ADDRESS, presaleAbi, SOFT_CAP_ETH, HARD_CAP_ETH } from '../config/contract'

function formatCountdown(seconds: number) {
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return { d, h, m, s }
}

export default function Hero() {
  const [now, setNow] = useState(Math.floor(Date.now() / 1000))

  useEffect(() => {
    const interval = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000)
    return () => clearInterval(interval)
  }, [])

  const { data: isStarted } = useReadContract({
    address: PRESALE_CONTRACT_ADDRESS,
    abi: presaleAbi,
    functionName: 'isStarted',
    query: { refetchInterval: 10_000 },
  })

  const { data: isActive } = useReadContract({
    address: PRESALE_CONTRACT_ADDRESS,
    abi: presaleAbi,
    functionName: 'isActive',
    query: { refetchInterval: 10_000 },
  })

  const { data: startTime } = useReadContract({
    address: PRESALE_CONTRACT_ADDRESS,
    abi: presaleAbi,
    functionName: 'startTime',
    query: { refetchInterval: 10_000 },
  })

  const { data: totalRaised } = useReadContract({
    address: PRESALE_CONTRACT_ADDRESS,
    abi: presaleAbi,
    functionName: 'totalRaised',
    query: { refetchInterval: 10_000 },
  })

  const { data: contributorCount } = useReadContract({
    address: PRESALE_CONTRACT_ADDRESS,
    abi: presaleAbi,
    functionName: 'getContributorCount',
    query: { refetchInterval: 10_000 },
  })

  const { data: timeRemaining } = useReadContract({
    address: PRESALE_CONTRACT_ADDRESS,
    abi: presaleAbi,
    functionName: 'timeRemaining',
    query: { refetchInterval: 10_000 },
  })

  const { data: remainingCapacity } = useReadContract({
    address: PRESALE_CONTRACT_ADDRESS,
    abi: presaleAbi,
    functionName: 'remainingCapacity',
    query: { refetchInterval: 10_000 },
  })

  const { data: softCapReachedAt } = useReadContract({
    address: PRESALE_CONTRACT_ADDRESS,
    abi: presaleAbi,
    functionName: 'softCapReachedAt',
    query: { refetchInterval: 10_000 },
  })

  const raised = totalRaised ? Number(formatEther(totalRaised)) : 0
  const progressPct = Math.min((raised / HARD_CAP_ETH) * 100, 100)
  const softCapPct = (SOFT_CAP_ETH / HARD_CAP_ETH) * 100
  const remaining = remainingCapacity ? Number(formatEther(remainingCapacity)) : HARD_CAP_ETH
  const contributors = contributorCount ? Number(contributorCount) : 0
  const softCapHit = softCapReachedAt ? Number(softCapReachedAt) > 0 : false

  // Countdown logic
  const startTimeSec = startTime ? Number(startTime) : 0
  const hasStarted = isStarted ?? false
  const secondsUntilStart = Math.max(0, startTimeSec - now)
  const contractTimeRemaining = timeRemaining ? Number(timeRemaining) : 0

  const showCountdownToStart = !hasStarted && startTimeSec > 0
  const showHardCapTimer = softCapHit && contractTimeRemaining > 0
  const countdown = showCountdownToStart
    ? formatCountdown(secondsUntilStart)
    : showHardCapTimer
      ? formatCountdown(contractTimeRemaining)
      : null

  return (
    <section className="hero">
      {/* Status badge */}
      <div className="hero-label">
        <span className={`dot ${isActive ? 'dot-live' : ''}`} />
        {showCountdownToStart
          ? 'Presale Starting Soon'
          : isActive
            ? 'Presale is Live'
            : 'Presale'}
      </div>

      <h1>
        {showCountdownToStart ? (
          <>
            $ARCA Presale
            <br />
            <em>starts soon.</em>
          </>
        ) : (
          <>
            $ARCA Presale
            <br />
            <em>is Live.</em>
          </>
        )}
      </h1>

      <p className="hero-sub">
        {showCountdownToStart
          ? 'The presale hasn\'t started yet. Connect your wallet and get ready.'
          : 'Contribute ETH to the $ARCA presale on Base. OG wallets get a 10% bonus. Soft cap 5 ETH, hard cap 12.5 ETH.'}
      </p>

      {/* Countdown */}
      {countdown && (
        <div className="countdown">
          <div className="countdown-label">
            {showCountdownToStart ? 'Starts in' : 'Hard cap deadline'}
          </div>
          <div className="countdown-grid">
            <div className="countdown-unit">
              <span className="countdown-num">{String(countdown.d).padStart(2, '0')}</span>
              <span className="countdown-lbl">Days</span>
            </div>
            <div className="countdown-sep">:</div>
            <div className="countdown-unit">
              <span className="countdown-num">{String(countdown.h).padStart(2, '0')}</span>
              <span className="countdown-lbl">Hours</span>
            </div>
            <div className="countdown-sep">:</div>
            <div className="countdown-unit">
              <span className="countdown-num">{String(countdown.m).padStart(2, '0')}</span>
              <span className="countdown-lbl">Min</span>
            </div>
            <div className="countdown-sep">:</div>
            <div className="countdown-unit">
              <span className="countdown-num">{String(countdown.s).padStart(2, '0')}</span>
              <span className="countdown-lbl">Sec</span>
            </div>
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className="progress-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPct}%` }}
          />
          <div
            className="soft-cap-marker"
            style={{ left: `${softCapPct}%` }}
          >
            <span>Soft Cap</span>
          </div>
        </div>
        <div className="progress-labels">
          <span>{raised.toFixed(3)} ETH</span>
          <span>{HARD_CAP_ETH} ETH</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value accent">{raised.toFixed(3)}</div>
          <div className="stat-label">ETH Raised</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{contributors}</div>
          <div className="stat-label">Contributors</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {showHardCapTimer
              ? `${formatCountdown(contractTimeRemaining).d}d ${formatCountdown(contractTimeRemaining).h}h`
              : softCapHit ? 'Ended' : 'No limit'}
          </div>
          <div className="stat-label">Time Left</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{remaining.toFixed(2)}</div>
          <div className="stat-label">ETH Remaining</div>
        </div>
      </div>

      <div className="hero-actions">
        <a href="#contribute" className="btn-primary">
          Contribute Now &rarr;
        </a>
        <a href="#info" className="btn-secondary">
          Learn More &rarr;
        </a>
      </div>
    </section>
  )
}
