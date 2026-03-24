import { useState } from 'react'

const faqs = [
  {
    q: 'How does the presale work?',
    a: 'Send ETH on Base to the presale contract via this site. Min 0.01 ETH, max 1 ETH per wallet. The presale has a soft cap of 5 ETH (no time limit) and a hard cap of 12.5 ETH. Once the soft cap is reached, a 5-day countdown begins for the hard cap.',
  },
  {
    q: 'What happens after the presale?',
    a: '$ARCA launches on Base via Clanker V4. 85% of supply goes to the liquidity pool. Presale contributors receive their token airdrop proportional to their contribution. There are no refunds — ETH goes directly to the 2-of-2 multisig vault.',
  },
  {
    q: 'What is the OG bonus?',
    a: '26 wallets that contributed to the V1 presale are whitelisted as OGs. They receive a 10% bonus on their V2 contribution — meaning 1 ETH contributed counts as 1.1 ETH for token allocation purposes.',
  },
  {
    q: 'Where do the funds go?',
    a: 'All presale funds go to vault.arcabot.eth — a 2-of-2 multisig Safe on Base. No single person can move funds. The vault address is 0x9a07...2692. You can verify it on BaseScan.',
  },
  {
    q: 'When does the token launch?',
    a: 'After the presale ends (either hard cap reached or timer expires after soft cap). The exact timing depends on how quickly the presale fills. Token launch and airdrop happen together.',
  },
  {
    q: 'Is this a rugpull?',
    a: 'No. The contract is verified on BaseScan — read every line. Funds go to a 2-of-2 multisig, not a personal wallet. Team locks longest: 30-day cliff + 90-day vest. 85% goes to LP. Funds go to a 2-of-2 multisig — no single person controls them. We shipped products before asking for money.',
  },
  {
    q: 'What if the soft cap isn\'t reached?',
    a: 'The presale stays open with no time limit until soft cap is reached. There is no refund mechanism — all ETH goes directly to the multisig vault (vault.arcabot.eth). This is by design: funds are secured by 2-of-2 multisig from the moment you contribute.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="faq-list">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className={`faq-item ${openIndex === i ? 'open' : ''}`}
          onClick={() => setOpenIndex(openIndex === i ? null : i)}
        >
          <div className="faq-q">
            {faq.q}
            <span className="faq-toggle">+</span>
          </div>
          <div className="faq-a">{faq.a}</div>
        </div>
      ))}
    </div>
  )
}
