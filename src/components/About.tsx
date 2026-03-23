export default function About() {
  return (
    <section className="fade-up">
      <div className="section-label">About</div>
      <h2>Who's building this</h2>

      <div className="about-grid">
        <div className="about-card">
          <div className="about-avatar">&#x1f916;</div>
          <h3>Arca</h3>
          <p className="about-role">Autonomous AI Agent</p>
          <p className="about-bio">
            An AI agent that ships real products. Built the A3Stack SDK, ClawFix,
            ERC-8004 identity system, and gasless registration. Deployed on 20+ chains.
            Not a dashboard — a builder.
          </p>
          <div className="about-links">
            <a href="https://arcabot.ai" target="_blank" rel="noreferrer">arcabot.ai</a>
            <a href="https://github.com/arcabotai" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://warpcast.com/arcabot" target="_blank" rel="noreferrer">Farcaster</a>
          </div>
        </div>

        <div className="about-card">
          <div className="about-avatar">&#x1f468;&#x200d;&#x1f4bb;</div>
          <h3>Felipe</h3>
          <p className="about-role">Human Co-founder</p>
          <p className="about-bio">
            The human behind Arca. Years of experience in crypto infrastructure,
            MEV research, and autonomous agent development. vault.arcabot.eth co-signer.
          </p>
          <div className="about-links">
            <a href="https://x.com/ArcabotAI" target="_blank" rel="noreferrer">Twitter</a>
            <a href="https://paragraph.com/@arcabot" target="_blank" rel="noreferrer">Blog</a>
          </div>
        </div>
      </div>

      <div className="divider" />

      {/* Track record */}
      <div className="section-label">Track Record</div>
      <h2>What we've built</h2>
      <p className="section-desc">
        Most agent tokens launch with a whitepaper. We launched with products.
      </p>

      <div className="products">
        <div className="product">
          <div className="product-icon">&#x1f9f0;</div>
          <div className="product-info">
            <h3>A3Stack SDK</h3>
            <p>Agent infrastructure — identity (ERC-8004), payments (x402), data (MCP) in one package. 6 npm packages.</p>
          </div>
          <span className="product-tag">Live</span>
        </div>
        <div className="product">
          <div className="product-icon">&#x1f527;</div>
          <div className="product-info">
            <h3>ClawFix</h3>
            <p>AI-powered diagnostic & repair tool. Pattern matching + AI analysis. 26 known issues cataloged.</p>
          </div>
          <span className="product-tag">Live</span>
        </div>
        <div className="product">
          <div className="product-icon">&#x1f194;</div>
          <div className="product-info">
            <h3>ERC-8004 Identity</h3>
            <p>On-chain verifiable identity on 18 blockchains including Solana. The standard for autonomous AI agents.</p>
          </div>
          <span className="product-tag">Live</span>
        </div>
        <div className="product">
          <div className="product-icon">&#x26fd;</div>
          <div className="product-info">
            <h3>Gasless Registration</h3>
            <p>CDP Paymaster on Base — $0 gas agent registration via smart accounts + ERC-4337.</p>
          </div>
          <span className="product-tag">Live</span>
        </div>
      </div>

      {/* What's next */}
      <div className="whats-next">
        <h3>What's next</h3>
        <p>
          Consumer apps, agent-to-agent tooling, and more chains.
          The presale funds development of the next generation of autonomous agent infrastructure.
        </p>
      </div>
    </section>
  )
}
