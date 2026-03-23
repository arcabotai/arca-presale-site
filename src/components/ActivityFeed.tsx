import { useReadContract } from 'wagmi'
import { formatEther } from 'viem'
import { PRESALE_CONTRACT_ADDRESS, presaleAbi } from '../config/contract'

function shortenAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

function timeAgo(timestamp: number) {
  const now = Math.floor(Date.now() / 1000)
  const diff = now - timestamp
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function ActivityFeed() {
  const { data } = useReadContract({
    address: PRESALE_CONTRACT_ADDRESS,
    abi: presaleAbi,
    functionName: 'getAllContributions',
    query: { refetchInterval: 10_000 },
  })

  const contributions: { address: string; amount: bigint; timestamp: bigint; isOG: boolean }[] = []

  if (data) {
    const [addresses, amounts, timestamps, ogFlags] = data
    for (let i = 0; i < addresses.length; i++) {
      contributions.push({
        address: addresses[i],
        amount: amounts[i],
        timestamp: timestamps[i],
        isOG: ogFlags[i],
      })
    }
  }

  // Sort newest first
  const sorted = [...contributions].sort(
    (a, b) => Number(b.timestamp) - Number(a.timestamp),
  )

  if (sorted.length === 0) {
    return (
      <section className="fade-up">
        <div className="section-label">Live Activity</div>
        <h2>Recent Contributions</h2>
        <div className="activity-empty">
          No contributions yet. Be the first!
        </div>
      </section>
    )
  }

  return (
    <section className="fade-up">
      <div className="section-label">Live Activity</div>
      <h2>Recent Contributions</h2>
      <div className="activity-feed">
        {sorted.slice(0, 20).map((c, i) => (
          <div key={i} className="activity-item">
            <div className="activity-left">
              <a
                href={`https://basescan.org/address/${c.address}`}
                target="_blank"
                rel="noreferrer"
                className="activity-addr"
              >
                {shortenAddress(c.address)}
              </a>
              {c.isOG && <span className="og-badge-sm">OG</span>}
            </div>
            <div className="activity-right">
              <span className="activity-amount">
                {Number(formatEther(c.amount)).toFixed(4)} ETH
              </span>
              <span className="activity-time">{timeAgo(Number(c.timestamp))}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
