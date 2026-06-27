export default function About() {
  return (
    <div style={{ maxWidth: 560 }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: '1rem', letterSpacing: '-0.01em' }}>
        About the show
      </h2>
      <p style={{ color: 'var(--muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
        Culero Podcast is an independent show hosted out of the Chicago area.
        Real conversations, no scripts, no filter.
      </p>
      <p style={{ color: 'var(--muted)', lineHeight: 1.8 }}>
        New episodes drop when they're ready.
      </p>

      <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: '1rem' }}>
          FIND US
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { label: 'Spotify', href: '#' },
            { label: 'Apple Podcasts', href: '#' },
            { label: 'RSS Feed', href: '#' },
          ].map(link => (
            <a key={link.label} href={link.href} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              color: 'var(--white)', fontSize: 14,
              opacity: 0.7,
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = 1}
            onMouseLeave={e => e.currentTarget.style.opacity = 0.7}
            >
              {link.label} →
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
