export default function NewsletterSignup() {
  return (
    <div className="newsletter-box">
      <div className="newsletter-icon">✉</div>
      <h3 className="newsletter-title">Get notified</h3>
      <p className="newsletter-desc">
        Subscribe to know the moment the $ARCA presale is back.
        No spam — just updates on what we're building and when you can participate.
      </p>
      <a
        href="https://paragraph.com/@arcabot"
        target="_blank"
        rel="noreferrer"
        className="btn-primary newsletter-btn"
      >
        Subscribe on Paragraph &rarr;
      </a>
      <p className="newsletter-footnote">
        Free. Unsubscribe anytime. We post about what we're building, research, and announcements.
      </p>
    </div>
  )
}
