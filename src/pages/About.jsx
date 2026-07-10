export default function About({ songs, setActiveTab }) {
  const episodeCount = songs.length
  const songCount = songs.reduce((n, s) => n + (Array.isArray(s.tracklist) ? s.tracklist.length : 0), 0)

  const stats = [
    { n: episodeCount || '—', label: 'Episodes' },
    { n: songCount ? songCount.toLocaleString() : '—', label: 'Songs played' },
    { n: '10', label: 'Radio stations' },
    { n: 'CHI', label: 'Made in Chicago' },
  ]

  return (
    <div>
      {/* Hero */}
      <div style={{ padding: '80px 40px 48px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', color: 'var(--gray-3)', textTransform: 'uppercase', marginBottom: 20, opacity: 0, animation: 'fadeUp 0.6s 0.1s forwards', fontFamily: 'var(--mono)' }}>The show</div>
        <h1 style={{ fontSize: 64, fontWeight: 900, letterSpacing: '-3px', lineHeight: 0.92, color: 'var(--black)', opacity: 0, animation: 'fadeUp 0.6s 0.25s forwards' }}>About.</h1>
      </div>

      {/* Stats strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 1, background: 'var(--border)', borderBottom: '1px solid var(--border)' }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: 'var(--bg)', padding: '28px 40px' }}>
            <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: '-1px', color: 'var(--gold)' }}>{s.n}</div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: 'var(--gray-3)', textTransform: 'uppercase', fontFamily: 'var(--mono)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Body */}
      <div style={{ maxWidth: 620, padding: '48px 40px' }}>
        <p style={{ fontSize: 16, color: 'var(--gray-1)', lineHeight: 1.8, marginBottom: 20 }}>
          Culero Podcast is an independent mixtape show made in Chicago. Every episode is a
          hand-built mix named after a place — from Topeka to Notting Hill to Salvador —
          stitched together from whatever's been in heavy rotation that month.
        </p>
        <p style={{ fontSize: 16, color: 'var(--gray-2)', lineHeight: 1.8, marginBottom: 20 }}>
          No algorithm, no genre rules. Indie, house, hip hop, post-punk, bachata — if it
          fits the mix, it's in. Real talk, no filter, since episode two (nobody knows what
          happened to episode one).
        </p>
        <p style={{ fontSize: 16, color: 'var(--gray-2)', lineHeight: 1.8 }}>
          New episodes drop when they're ready.
        </p>

        {/* Find us */}
        <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: 'var(--gray-3)', textTransform: 'uppercase', fontFamily: 'var(--mono)', marginBottom: 16 }}>Find us</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Spotify', soon: true },
              { label: 'Apple Podcasts', soon: true },
              { label: 'RSS Feed', soon: true },
            ].map(link => (
              <div key={link.label} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--gray-3)' }}>
                {link.label}
                <span style={{ fontSize: 10, fontFamily: 'var(--mono)', letterSpacing: '0.08em', border: '1px solid var(--border-strong)', borderRadius: 999, padding: '1px 8px' }}>COMING SOON</span>
              </div>
            ))}
            <button
              onClick={() => setActiveTab('comments')}
              style={{ alignSelf: 'flex-start', marginTop: 8, background: 'none', border: '1px solid var(--border-strong)', borderRadius: 999, color: 'var(--black)', padding: '9px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'border-color 0.15s, color 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--black)' }}
            >
              Say something → Comments
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
