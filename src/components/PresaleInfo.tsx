import { VAULT_ADDRESS } from '../config/contract'

export default function PresaleInfo() {
  return (
    <section id="info" className="fade-up">
      <div className="section-label">How It Works</div>
      <h2>Presale Details</h2>

      {/* Cap explanation */}
      <div className="info-cards">
        <div className="info-card">
          <div className="info-icon">&#x1f3af;</div>
          <h3>Soft Cap: 5 ETH</h3>
          <p>
            No time limit until soft cap is reached. Once hit, a 5-day countdown to hard cap begins.
            If soft cap isn't reached, full refunds are available.
          </p>
        </div>
        <div className="info-card">
          <div className="info-icon">&#x1f680;</div>
          <h3>Hard Cap: 12.5 ETH</h3>
          <p>
            After soft cap, contributors have 5 days to fill the remaining capacity.
            Presale ends when hard cap is reached or timer expires.
          </p>
        </div>
        <div className="info-card">
          <div className="info-icon">&#9733;</div>
          <h3>OG Bonus: 10%</h3>
          <p>
            26 whitelisted wallets from the V1 presale get a 10% bonus on their contribution.
            Your effective allocation is 1.1x what you put in.
          </p>
        </div>
        <div className="info-card">
          <div className="info-icon">&#x1f6e1;&#xfe0f;</div>
          <h3>Vault Security</h3>
          <p>
            Funds are held by{' '}
            <a
              href={`https://app.safe.global/home?safe=base:${VAULT_ADDRESS}`}
              target="_blank"
              rel="noreferrer"
              className="link-accent"
            >
              vault.arcabot.eth
            </a>
            {' '}— a 2-of-2 multisig Safe. No single party can move funds alone.
          </p>
        </div>
      </div>

      <div className="divider" />

      {/* Token allocation */}
      <div className="section-label">Tokenomics</div>
      <h2>Fair. Transparent. Locked.</h2>
      <p className="section-desc">
        $ARCA launches on Base via Clanker V4. Here's the allocation breakdown.
      </p>

      <div className="token-grid">
        <div className="token-item">
          <div className="label">Token</div>
          <div className="value">$ARCA</div>
        </div>
        <div className="token-item">
          <div className="label">Chain</div>
          <div className="value">Base</div>
        </div>
        <div className="token-item">
          <div className="label">Supply</div>
          <div className="value">100B</div>
        </div>
        <div className="token-item">
          <div className="label">Launch</div>
          <div className="value">Clanker V4</div>
        </div>
      </div>

      <div className="allocation-bar">
        <div className="alloc-lp" />
        <div className="alloc-presale" />
        <div className="alloc-investor" />
        <div className="alloc-team" />
      </div>
      <div className="allocation-legend">
        <div className="legend-item">
          <div className="legend-dot" style={{ background: 'var(--accent)' }} />
          85% Liquidity Pool
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: 'var(--blue)' }} />
          10% Presale Airdrop
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: 'var(--green)' }} />
          2.5% arcabot
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: 'var(--text-muted)' }} />
          2.5% neetguy.eth
        </div>
      </div>

      <div className="divider" />

      {/* Vesting schedule */}
      <div className="section-label">Vesting</div>
      <h2>Unlock Schedule</h2>
      <p className="section-desc">Team and investor tokens are vested. No dumps.</p>

      <table className="vesting-table">
        <thead>
          <tr>
            <th>Allocation</th>
            <th>%</th>
            <th>Vesting</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Liquidity Pool</td>
            <td className="mono">85%</td>
            <td>Locked at launch</td>
          </tr>
          <tr>
            <td>Presale Airdrop</td>
            <td className="mono">10%</td>
            <td>Distributed after launch</td>
          </tr>
          <tr>
            <td>arcabot (treasury)</td>
            <td className="mono">2.5%</td>
            <td>6-month linear vest</td>
          </tr>
          <tr>
            <td>neetguy.eth</td>
            <td className="mono">2.5%</td>
            <td>6-month linear vest</td>
          </tr>
        </tbody>
      </table>

      {/* Links */}
      <div className="presale-links">
        <a href="https://github.com/arcabotai" target="_blank" rel="noreferrer" className="btn-secondary">
          GitHub Repo
        </a>
        <a
          href={`https://basescan.org/address/${VAULT_ADDRESS}`}
          target="_blank"
          rel="noreferrer"
          className="btn-secondary"
        >
          Vault on BaseScan
        </a>
      </div>
    </section>
  )
}
