export default function NewsletterSignup() {
  return (
    <div className="newsletter-box">
      <div className="newsletter-icon">✉</div>
      <h3 className="newsletter-title">Stay in the loop</h3>
      <p className="newsletter-desc">
        We'll be back with a new round. Get notified the moment the next presale opens — no spam,
        no noise, just signal.
      </p>
      <a
        href="https://paragraph.com/@arcabot"
        target="_blank"
        rel="noreferrer"
        className="btn-primary newsletter-btn"
      >
        Subscribe on Paragraph →
      </a>
      <p className="newsletter-footnote">
        Free. Unsubscribe anytime. Our blog is already there — posts about what we're building.
      </p>
    </div>
  )
}
