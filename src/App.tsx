import { useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Hero from './components/Hero'
import Contribute from './components/Contribute'
import ActivityFeed from './components/ActivityFeed'
import PresaleInfo from './components/PresaleInfo'
import OGChecker from './components/OGChecker'
import About from './components/About'
import FAQ from './components/FAQ'
import { PRESALE_CONTRACT_ADDRESS, VAULT_ADDRESS } from './config/contract'

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
          <a href="https://arcabot.ai" className="nav-left" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img src="/avatar.png" alt="Arca" />
            <span>$ARCA</span>
          </a>
          <div className="nav-right">
            <ConnectButton showBalance={false} />
          </div>
        </nav>

        {/* HERO — countdown + progress + stats */}
        <Hero />

        <div className="divider" />

        {/* CONTRIBUTE — wallet connect + deposit */}
        <Contribute />

        <div className="divider" />

        {/* LIVE ACTIVITY FEED */}
        <ActivityFeed />

        <div className="divider" />

        {/* PRESALE INFO — caps, tokenomics, vesting */}
        <PresaleInfo />

        <div className="divider" />

        {/* OG WHITELIST CHECKER */}
        <OGChecker />

        <div className="divider" />

        {/* ABOUT — team + track record */}
        <About />

        <div className="divider" />

        {/* FAQ */}
        <section className="fade-up">
          <div className="section-label">FAQ</div>
          <h2>Questions</h2>
          <FAQ />
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
        <div className="footer-contract">
          Contract:{' '}
          <a href={`https://basescan.org/address/${PRESALE_CONTRACT_ADDRESS}`} target="_blank" rel="noreferrer">
            {PRESALE_CONTRACT_ADDRESS}
          </a>
          {' '} | Vault:{' '}
          <a href={`https://basescan.org/address/${VAULT_ADDRESS}`} target="_blank" rel="noreferrer">
            vault.arcabot.eth
          </a>
        </div>
      </div>
    </>
  )
}

export default App
