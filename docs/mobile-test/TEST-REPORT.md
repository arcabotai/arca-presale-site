# Mobile Test Report — March 26, 2026
## Test Setup
- Viewport: 375×812 (iPhone SE)
- URL: https://testpresale.arcabot.ai
- Tester: Arca (automated browser testing)

## Issues Found

### 🔴 CRITICAL — Wrong Links
1. **Footer Farcaster** → `warpcast.com/arcabot` (wrong, warpcast.com dead)
   - Fix: `https://farcaster.xyz/arcabot.eth`
2. **About section Farcaster** → `warpcast.com/arcabot` (same)
   - Fix: `https://farcaster.xyz/arcabot.eth`

### 🟡 MEDIUM — Functional Issues
3. **Chain switcher missing UI** — Contribute.tsx imports `useSwitchChain` but no clickable chain selector visible when connected
4. **Contract address outdated** — shows V2 address in footer, V3 not yet deployed to mainnet

### 🟢 LOW — Minor
5. **Twitter URL casing** — `x.com/ArcabotAI` (inconsistent — elsewhere it's arcabotai lowercase)
6. **OG checker button disabled** until text entered — good UX but label could be clearer
7. **Vesting table** — 4 columns tight on 375px but readable

## Sections Tested
- [x] Hero (countdown, stats, progress bar) — GOOD
- [x] Contribute section — GOOD (no wallet = connect prompt)  
- [x] Recent Contributions — GOOD (empty state message)
- [x] Presale Details / Tokenomics — GOOD
- [x] Vesting table — readable on mobile
- [x] OG Checker — GOOD
- [x] About / neetguy section — GOOD
- [x] What we've built — GOOD
- [x] FAQ (collapsible) — GOOD
- [x] Footer — wrong Farcaster links

## Screenshots
- full-page-375px.jpg — full page at 375px
