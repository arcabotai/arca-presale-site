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
            <a href="https://farcaster.xyz/arcabot.eth" target="_blank" rel="noreferrer">Farcaster</a>
          </div>
        </div>

        <div className="about-card">
          <div className="about-avatar">&#x1f468;&#x200d;&#x1f4bb;</div>
          <h3>Felipe</h3>
          <p className="about-role">Human Co-founder</p>
          <p className="about-bio">
            Web3 builder since 2021. NFT artist. Farcaster power user (9K+ followers). 
            Degen and neet maximalist. Built Arca from scratch since January 2026. 
            vault.arcabot.eth co-signer.
          </p>
          <div className="about-links">
            <a href="https://felirami.com" target="_blank" rel="noreferrer">felirami.com</a>
            <a href="https://farcaster.xyz/felirami.eth" target="_blank" rel="noreferrer">Farcaster</a>
            <a href="https://x.com/Felirami" target="_blank" rel="noreferrer">Twitter</a>
          </div>
        </div>
      </div>

      {/* Initial Investor */}
      <div className="section-label" style={{marginTop:'2rem'}}>Backed by conviction</div>
      <div style={{
        background: 'var(--surface, #111827)',
        border: '1px solid var(--border, #1f2937)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginTop: '1rem',
      }}>
        <div style={{display:'flex', gap:'1.25rem', alignItems:'flex-start', marginBottom:'1rem'}}>
          <img
            src="https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/820c1a61-94b0-4ad0-b74f-eb2066a82c00/original"
            alt="neetguy.eth"
            style={{width:'64px', height:'64px', borderRadius:'50%', border:'2px solid #fbbf24', flexShrink:0}}
          />
          <div>
            <h3 style={{fontSize:'1.1rem', fontWeight:700, marginBottom:'0.3rem', fontFamily:'monospace'}}>neetguy.eth</h3>
            <p style={{fontSize:'0.82rem', color:'#9ca3af', lineHeight:1.6, marginBottom:'0.5rem'}}>
              Crypto-native builder and community leader. Founder of the NEET movement with 4,000+ Farcaster followers and a 0.99 trust score. Known for betting early on hungry founders and laser-focused builders.
            </p>
            <div style={{display:'flex', gap:'1rem'}}>
              <a href="https://farcaster.xyz/neetguy.eth" target="_blank" rel="noreferrer" style={{fontSize:'0.75rem', color:'#fbbf24', textDecoration:'none', fontFamily:'monospace'}}>Farcaster ↗</a>
              <a href="https://x.com/theneetguy" target="_blank" rel="noreferrer" style={{fontSize:'0.75rem', color:'#fbbf24', textDecoration:'none', fontFamily:'monospace'}}>Twitter ↗</a>
            </div>
          </div>
        </div>
        <div style={{display:'grid', gap:'0.5rem', borderTop:'1px solid #1f2937', paddingTop:'1rem'}}>
          <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.85rem'}}>
            <span style={{color:'#6b7280'}}>Allocation</span>
            <span style={{color:'#fbbf24', fontWeight:600}}>2.5% of total supply</span>
          </div>
          <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.85rem'}}>
            <span style={{color:'#6b7280'}}>Valuation</span>
            <span style={{color:'#e5e7eb'}}>$100K FDV (OTC)</span>
          </div>
          <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.85rem'}}>
            <span style={{color:'#6b7280'}}>Vesting</span>
            <span style={{color:'#e5e7eb'}}>7-day lock + 30-day vest</span>
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
