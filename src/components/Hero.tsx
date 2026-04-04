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

function formatUsd(value: number): string {
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`
  return `$${value.toFixed(0)}`
}

function useEthPrice() {
  const [price, setPrice] = useState<number | null>(null)

  useEffect(() => {
    const fetchPrice = () => {
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
        .then((r) => r.json())
        .then((data) => {
          if (data?.ethereum?.usd) setPrice(data.ethereum.usd)
        })
        .catch(() => {})
    }
    fetchPrice()
    const interval = setInterval(fetchPrice, 60_000)
    return () => clearInterval(interval)
  }, [])

  return price
}

export default function Hero() {
  const [now, setNow] = useState(Math.floor(Date.now() / 1000))
  const ethPrice = useEthPrice()

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

  const { data: currentMultiplier } = useReadContract({
    address: PRESALE_CONTRACT_ADDRESS,
    abi: presaleAbi,
    functionName: 'currentMultiplier',
    query: { refetchInterval: 10_000 },
  })

  const raised = totalRaised ? Number(formatEther(totalRaised)) : 0
  const progressPct = Math.min((raised / HARD_CAP_ETH) * 100, 100)
  const softCapPct = (SOFT_CAP_ETH / HARD_CAP_ETH) * 100
  const remaining = remainingCapacity ? Number(formatEther(remainingCapacity)) : HARD_CAP_ETH
  const contributors = contributorCount ? Number(contributorCount) : 0
  const softCapHit = softCapReachedAt ? Number(softCapReachedAt) > 0 : false

  // Multiplier: contract returns value with 2 decimals (e.g. 142 = 1.42x)
  const multiplier = currentMultiplier ? Number(currentMultiplier) / 100 : null

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

      {/* Multiplier banner */}
      {multiplier && multiplier > 1 && (
        <div className="multiplier-banner">
          Current multiplier: <span className="multiplier-value">{multiplier.toFixed(2)}x</span> — contribute now for more tokens
        </div>
      )}

      <div style={{
        background: 'rgba(251,191,36,0.08)',
        border: '1px solid rgba(251,191,36,0.2)',
        borderRadius: '12px',
        padding: '0.75rem 1rem',
        marginTop: '0.75rem',
        marginBottom: '2rem',
        fontSize: '0.85rem',
        color: '#fbbf24',
        textAlign: 'center',
        lineHeight: 1.5,
      }}>
        Every contributor will receive $ARCA tokens when the token launches. No time limit before soft cap — the presale stays open until 5 ETH is reached.
      </div>

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
          <span>
            {raised.toFixed(3)} ETH
            {ethPrice ? ` (~${formatUsd(raised * ethPrice)})` : ''}
          </span>
          <span>
            {HARD_CAP_ETH} ETH
            {ethPrice ? ` (~${formatUsd(HARD_CAP_ETH * ethPrice)})` : ''}
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value accent">{raised.toFixed(3)}</div>
          <div className="stat-label">ETH Raised</div>
          {ethPrice && <div className="stat-usd">~{formatUsd(raised * ethPrice)}</div>}
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
          {ethPrice && <div className="stat-usd">~{formatUsd(remaining * ethPrice)}</div>}
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
