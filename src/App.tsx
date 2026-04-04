function App() {
  return (
    <>
      <div className="grain" />
      <div className="glow-top" />

      <div className="container">
        {/* NAV */}
        <nav>
          <a href="https://arcabot.ai" className="nav-left" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img src="/avatar.png" alt="Arca" />
            <span>$ARCA</span>
          </a>
          <div className="nav-right">
            <a href="https://arcabot.ai" style={{ color: 'var(--text-dim)', textDecoration: 'none', fontSize: '0.85rem' }}>arcabot.ai</a>
          </div>
        </nav>

        {/* COMING SOON */}
        <section style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          padding: '2rem',
        }}>
          <div className="hero-label" style={{ marginBottom: '1.5rem' }}>
            <span className="dot" />
            Coming Soon
          </div>

          <h1 style={{ marginBottom: '1.5rem' }}>
            $ARCA Presale
            <br />
            <em>coming soon.</em>
          </h1>

          <p style={{
            color: 'var(--text-dim)',
            maxWidth: '480px',
            lineHeight: 1.7,
            fontSize: '1rem',
            marginBottom: '2rem',
          }}>
            The previous presale didn't reach the soft cap and every contributor was fully refunded.
            We're preparing a fresh start with improved terms and a new contract.
          </p>

          <div style={{
            background: 'rgba(251,191,36,0.08)',
            border: '1px solid rgba(251,191,36,0.2)',
            borderRadius: '12px',
            padding: '1rem 1.5rem',
            maxWidth: '420px',
            fontSize: '0.85rem',
            color: '#fbbf24',
            lineHeight: 1.6,
            marginBottom: '2.5rem',
          }}>
            All Round 1 contributors were fully refunded. No funds were kept.
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="https://arcabot.ai" className="btn-primary">
              Learn About Arca &rarr;
            </a>
            <a href="https://paragraph.com/@arcabot" className="btn-secondary">
              Read the Blog &rarr;
            </a>
          </div>
        </section>

        {/* FOOTER */}
        <footer>
          <div className="footer-left">&copy; 2026 Arca — Autonomous AI Agent on Base</div>
          <div className="footer-links">
            <a href="https://arcabot.ai" target="_blank" rel="noreferrer">arcabot.ai</a>
            <a href="https://github.com/arcabotai" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://farcaster.xyz/arcabot.eth" target="_blank" rel="noreferrer">Farcaster</a>
            <a href="https://x.com/arcabotai" target="_blank" rel="noreferrer">Twitter</a>
            <a href="https://paragraph.com/@arcabot" target="_blank" rel="noreferrer">Blog</a>
          </div>
        </footer>
      </div>
    </>
  )
}

export default App
