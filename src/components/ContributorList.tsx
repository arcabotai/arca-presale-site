import { useReadContract, useReadContracts } from 'wagmi'
import { useEnsName } from 'wagmi'
import { formatEther, type Address } from 'viem'
import { mainnet } from 'wagmi/chains'
import { presaleAbi, PRESALE_CONTRACT_ADDRESS } from '../config/contract'

function shortenAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

function ContributorRow({ address: addr, rank }: { address: Address; rank: number }) {
  const { data: ensName } = useEnsName({
    address: addr,
    chainId: mainnet.id,
  })

  const { data: contribution } = useReadContract({
    address: PRESALE_CONTRACT_ADDRESS,
    abi: presaleAbi,
    functionName: 'contributions',
    args: [addr],
  })

  const { data: effective } = useReadContract({
    address: PRESALE_CONTRACT_ADDRESS,
    abi: presaleAbi,
    functionName: 'effectiveContributions',
    args: [addr],
  })

  const amount = contribution ? formatEther(contribution) : '...'
  const effectiveAmt = effective ? formatEther(effective) : null
  const hasBonus = effective && contribution && effective > contribution
  const displayName = ensName || shortenAddress(addr)
  const basescanUrl = `https://basescan.org/address/${addr}`

  return (
    <div className="contributor-row">
      <div className="contributor-rank">#{rank}</div>
      <div className="contributor-identity">
        <a href={basescanUrl} target="_blank" rel="noreferrer" className="contributor-name">
          {ensName ? (
            <span className="ens-name">{ensName}</span>
          ) : (
            <span className="wallet-addr">{shortenAddress(addr)}</span>
          )}
        </a>
        {ensName && (
          <span className="contributor-addr-sub">{shortenAddress(addr)}</span>
        )}
      </div>
      <div className="contributor-amount">
        <span className="amount-value">{parseFloat(amount).toFixed(4)} ETH</span>
        {hasBonus && effectiveAmt ? (
          <span className="amount-bonus">
            +{(parseFloat(effectiveAmt) - parseFloat(amount)).toFixed(4)} bonus
          </span>
        ) : null}
      </div>
    </div>
  )
}

export default function ContributorList() {
  const { data: contributors } = useReadContract({
    address: PRESALE_CONTRACT_ADDRESS,
    abi: presaleAbi,
    functionName: 'getContributors',
    query: { refetchInterval: 15000 },
  })

  if (!contributors || contributors.length === 0) {
    return (
      <div className="contributors-section">
        <div className="section-label" style={{ marginBottom: '0.75rem' }}>Contributors</div>
        <div className="contributors-empty">
          No contributors yet. Be the first!
        </div>
      </div>
    )
  }

  return (
    <div className="contributors-section">
      <div className="contributors-header">
        <span className="section-label" style={{ marginBottom: 0 }}>Contributors</span>
        <span className="contributor-count">{contributors.length} backer{contributors.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="contributors-list">
        {[...contributors].reverse().map((addr, i) => (
          <ContributorRow
            key={addr}
            address={addr}
            rank={contributors.length - i}
          />
        ))}
      </div>
    </div>
  )
}
