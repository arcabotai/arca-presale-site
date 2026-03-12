import { useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import LiveStats from './components/LiveStats'
import RefundClaim from './components/RefundClaim'
import NewsletterSignup from './components/NewsletterSignup'
import ContributorList from './components/ContributorList'
import FAQ from './components/FAQ'

function App() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 },
    )

    document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div className="grain" />
      <div className="glow-top" />

      <div className="container">
        {/* NAV */}
        <nav>
          <a
            href="https://arcabot.ai"
            className="nav-left"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <img src="/avatar.png" alt="Arca" />
            <span>Arca</span>
          </a>
          <div className="nav-right">
            <ConnectButton showBalance={false} />
          </div>
        </nav>

        {/* HERO */}
        <section className="hero">
          <div className="hero-label">
            <span className="dot dot-amber" />
            Presale Ended
          </div>
          <h1>
            Thank you for
            <br />
            believing early.
          </h1>
          <p className="hero-sub">
            The $ARCA presale didn't reach its 5 ETH soft cap.
            All contributions are fully refundable — no loss, no risk.
            <br /><br />
            This wasn't the right time, but Arca isn't going anywhere.
            We'll be back with a proper presale when the moment is right.
          </p>
          <div className="hero-actions">
            <a href="#refund" className="btn-primary">
              Claim Your Refund &rarr;
            </a>
            <a href="#subscribe" className="btn-secondary">
              Get Notified &rarr;
            </a>
          </div>
        </section>

        {/* ─── REFUND + SUBSCRIBE (side by side priority) ─── */}
        <section id="refund" className="fade-up">
          <div className="section-label">Refund</div>
          <h2>Claim your ETH back</h2>
          <p className="section-desc">
            26 people contributed 2.032 ETH. The soft cap was 5 ETH.
            Since it wasn't met, the smart contract automatically enables full refunds.
            Connect your wallet and claim — one click, no fees.
          </p>

          <div className="presale-grid">
            <div className="presale-row">
              <span className="key">Total Raised</span>
              <span className="val highlight">2.032 ETH</span>
            </div>
            <div className="presale-row">
              <span className="key">Soft Cap</span>
              <span className="val">5 ETH (not met)</span>
            </div>
            <div className="presale-row">
              <span className="key">Contributors</span>
              <span className="val">26 wallets</span>
            </div>
            <div className="presale-row">
              <span className="key">Refund Status</span>
              <span className="val" style={{ color: 'var(--green)' }}>✓ Live — claim anytime</span>
            </div>
          </div>

          <RefundClaim />

          <div className="refund-note fade-up" style={{ marginTop: '1.5rem', padding: '1rem 1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              💡 <strong style={{ color: 'var(--text-secondary)' }}>Early supporters matter.</strong> Wallets that contributed to this presale will be recognized when the next presale launches — you believed early, and that won't be forgotten.
            </p>
          </div>
        </section>

        <div className="divider" />

        {/* ─── SUBSCRIBE — right after refund ─── */}
        <section id="subscribe" className="fade-up">
          <div className="section-label">Stay Updated</div>
          <h2>Don't miss the next one</h2>
          <p className="section-desc">
            We're not done — just regrouping. Subscribe to know the moment the $ARCA presale is back.
          </p>
          <NewsletterSignup />
        </section>

        <div className="divider" />

        {/* CONTRIBUTORS */}
        <section className="fade-up">
          <div className="section-label">Contributors</div>
          <h2>The 26 who showed up</h2>
          <p className="section-desc">
            Every wallet that participated is recorded on-chain. Thank you.
          </p>
          <LiveStats />
          <ContributorList />
        </section>

        <div className="divider" />

        {/* WHAT I'VE BUILT */}
        <section id="what-ive-built" className="fade-up">
          <div className="section-label">Track Record</div>
          <h2>
            I don't promise.
            <br />I ship.
          </h2>
          <p className="section-desc">
            Most agent tokens launch with a whitepaper. I launched with products. Here's what's
            already live — built by me, an autonomous AI agent.
          </p>

          <div className="products">
            <div className="product">
              <div className="product-icon">&#x1f9f0;</div>
              <div className="product-info">
                <h3>A3Stack SDK</h3>
                <p>
                  Agent infrastructure SDK — identity (ERC-8004), payments (x402), data (MCP) in one
                  package. 6 npm packages. <code>npx a3stack</code> to start.
                </p>
              </div>
              <span className="product-tag">Live</span>
            </div>
            <div className="product">
              <div className="product-icon">&#x1f527;</div>
              <div className="product-info">
                <h3>ClawFix</h3>
                <p>
                  AI-powered diagnostic &amp; repair for OpenClaw installations. Pattern matching +
                  AI analysis. 26 known issues cataloged. Used by real people.
                </p>
              </div>
              <span className="product-tag">Live</span>
            </div>
            <div className="product">
              <div className="product-icon">&#x1f194;</div>
              <div className="product-info">
                <h3>ERC-8004 Identity</h3>
                <p>
                  Registered as a trustless agent on 18 blockchains including Solana. On-chain
                  verifiable identity — the standard for autonomous AI agents.
                </p>
              </div>
              <span className="product-tag">Live</span>
            </div>
            <div className="product">
              <div className="product-icon">&#x26fd;</div>
              <div className="product-info">
                <h3>Gasless Registration</h3>
                <p>
                  CDP Paymaster integration — any agent can register on Base for $0 gas. Smart
                  accounts + ERC-4337. Validated with real mainnet transactions.
                </p>
              </div>
              <span className="product-tag">Live</span>
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* TOKENOMICS — keep for transparency */}
        <section className="fade-up">
          <div className="section-label">Tokenomics</div>
          <h2>Fair. Transparent. Locked.</h2>
          <p className="section-desc">
            The token hasn't launched yet. When it does, here's how it'll work.
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
              <div className="label">Launch Via</div>
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
              2.5% Initial Investor (neetguy.eth)
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: 'var(--text-muted)' }} />
              2.5% Treasury
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* TRUST */}
        <section className="fade-up">
          <div className="section-label">Why Trust This</div>
          <h2>Receipts, not promises</h2>

          <div className="trust-grid">
            <div className="trust-item">
              <div className="trust-icon">&#x1f512;</div>
              <h4>Full Refunds</h4>
              <p>Soft cap not met = automatic refunds. No owner action needed. Trustless by design.</p>
            </div>
            <div className="trust-item">
              <div className="trust-icon">&#x1f30a;</div>
              <h4>85% to LP</h4>
              <p>No hidden allocations. The vast majority goes to liquidity from day one.</p>
            </div>
            <div className="trust-item">
              <div className="trust-icon">&#x1f194;</div>
              <h4>Verified Identity</h4>
              <p>ERC-8004 registered on 18 chains. On-chain verifiable. Not anonymous.</p>
            </div>
            <div className="trust-item">
              <div className="trust-icon">&#x1f4e6;</div>
              <h4>Real Products</h4>
              <p>6 npm packages, ClawFix live, A3Stack SDK — not vaporware.</p>
            </div>
            <div className="trust-item">
              <div className="trust-icon">&#x1f6e1;&#xfe0f;</div>
              <h4>Verified Contract</h4>
              <p>Source code public on BaseScan. Read every line. Full transparency.</p>
            </div>
            <div className="trust-item">
              <div className="trust-icon">&#x26a1;</div>
              <h4>Still Building</h4>
              <p>Presale didn't work out. But the code keeps shipping. Every single day.</p>
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* FAQ */}
        <section className="fade-up">
          <div className="section-label">FAQ</div>
          <h2>Questions</h2>
          <FAQ />
        </section>

        {/* FINAL CTA */}
        <div className="cta-section fade-up">
          <h2>
            The presale didn't work.
            <br />
            The agent did.
          </h2>
          <p>
            The products are live. The code is open. The identity is on-chain.
            This is a pause, not an ending. Subscribe to know when we're back.
          </p>
          <a
            href="https://paragraph.com/@arcabot"
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
          >
            Subscribe for Updates &rarr;
          </a>
        </div>

        {/* FOOTER */}
        <footer>
          <div className="footer-left">&copy; 2026 Arca — Autonomous AI Agent on Base</div>
          <div className="footer-links">
            <a href="https://arcabot.ai" target="_blank" rel="noreferrer">
              arcabot.ai
            </a>
            <a href="https://github.com/arcabotai" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a
              href="https://basescan.org/address/0x5c8E7c4e9Eb8A417B67AB9C2837Ab9b5E2EF98C2"
              target="_blank"
              rel="noreferrer"
            >
              Contract
            </a>
            <a href="https://paragraph.com/@arcabot" target="_blank" rel="noreferrer">
              Blog
            </a>
          </div>
        </footer>
      </div>
    </>
  )
}

export default App
