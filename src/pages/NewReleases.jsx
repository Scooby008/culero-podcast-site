import { useEffect, useState } from 'react'

const GENRES = [
  { id: 18, name: 'Hip Hop' }, { id: 21, name: 'Rock' }, { id: 14, name: 'Pop' },
  { id: 7, name: 'Electronic' }, { id: 17, name: 'EDM' },
]

export default function NewReleases({ songs, setCurrentIndex, setActiveTab }) {
  const [releases, setReleases] = useState([])
  const [loading, setLoading] = useState(true)
  const cutoff = new Date(); cutoff.setMonth(cutoff.getMonth() - 2)
  const recentUploads = songs.filter(s => new Date(s.created_at) >= cutoff)

  useEffect(() => { loadReleases() }, [])

  async function loadReleases() {
    try {
      const results = await Promise.all(GENRES.map(async g => {
        const res = await fetch(`https://itunes.apple.com/us/rss/topalbums/limit=100/genre=${g.id}/json`)
        if (!res.ok) return []
        const data = await res.json()
        const entries = data.feed?.entry || []
        const list = Array.isArray(entries) ? entries : [entries]
        return list.map(e => ({
          id: e.id?.attributes?.['im:id'],
          name: e['im:name']?.label,
          artist: e['im:artist']?.label,
          releaseDate: e['im:releaseDate']?.label,
          artwork: e['im:image']?.[e['im:image'].length - 1]?.label,
          viewUrl: e.link?.attributes?.href,
          genre: g.name,
        }))
      }))
      const seen = new Set()
      const all = results.flat().filter(r => {
        if (!r.releaseDate || new Date(r.releaseDate) < cutoff || seen.has(r.id)) return false
        seen.add(r.id); return true
      })
      all.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
      setReleases(all)
    } catch {}
    setLoading(false)
  }

  const cardStyle = { background: 'var(--bg)', cursor: 'pointer', transition: 'background 0.2s, transform 0.2s, box-shadow 0.2s', transform: 'translateY(0)', boxShadow: 'none' }

  function cardEnter(e) {
    e.currentTarget.style.background = 'var(--bg-2)'
    e.currentTarget.style.transform = 'translateY(-3px)'
    e.currentTarget.style.boxShadow = '0 10px 28px rgba(10,10,10,0.08)'
    const img = e.currentTarget.querySelector('img')
    if (img) img.style.transform = 'scale(1.06)'
    const overlay = e.currentTarget.querySelector('.play-overlay')
    if (overlay) overlay.style.opacity = 1
  }

  function cardLeave(e) {
    e.currentTarget.style.background = 'var(--bg)'
    e.currentTarget.style.transform = 'translateY(0)'
    e.currentTarget.style.boxShadow = 'none'
    const img = e.currentTarget.querySelector('img')
    if (img) img.style.transform = 'scale(1)'
    const overlay = e.currentTarget.querySelector('.play-overlay')
    if (overlay) overlay.style.opacity = 0
  }

  return (
    <div>
      <div style={{ padding: '80px 40px 64px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', color: 'var(--gray-3)', textTransform: 'uppercase', marginBottom: 20, opacity: 0, animation: 'fadeUp 0.6s 0.1s forwards' }}>Fresh drops</div>
        <h1 style={{ fontSize: 64, fontWeight: 900, letterSpacing: '-3px', lineHeight: 0.92, color: 'var(--black)', opacity: 0, animation: 'fadeUp 0.6s 0.25s forwards' }}>New releases.</h1>
      </div>

      {recentUploads.length > 0 && (
        <>
          <div style={{ padding: '24px 40px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: 'var(--gray-3)', textTransform: 'uppercase', paddingBottom: 16 }}>Your uploads</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1px', background: 'var(--border)', borderBottom: '1px solid var(--border)' }}>
            {recentUploads.map(song => (
              <div key={song.id} style={cardStyle} onClick={() => { setCurrentIndex(songs.findIndex(s => s.id === song.id)); setActiveTab('intro') }}
                onMouseEnter={cardEnter}
                onMouseLeave={cardLeave}
              >
                <div style={{ position: 'relative', aspectRatio: '1/1', background: 'var(--bg-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {song.cover_url ? <img src={song.cover_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.35s ease' }} /> : <span style={{ fontSize: 32 }}>♪</span>}
                  <div className="play-overlay" style={{ position: 'absolute', right: 10, bottom: 10, width: 28, height: 28, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#1a1400', opacity: 0, transition: 'opacity 0.2s' }}>▶</div>
                </div>
                <div style={{ padding: '12px 16px' }}>
                  <div style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{song.mixtape_name}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--black)' }}>{song.title}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div style={{ padding: '24px 40px 0' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: 'var(--gray-3)', textTransform: 'uppercase', paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>From record labels</div>
      </div>
      {loading ? (
        <div style={{ padding: 40, color: 'var(--gray-1)', fontSize: 14, background: 'var(--bg)' }}>Loading...</div>
      ) : (
        Object.entries(
          releases.reduce((groups, r) => {
            const key = new Date(r.releaseDate).toDateString()
            ;(groups[key] = groups[key] || []).push(r)
            return groups
          }, {})
        )
          .sort((a, b) => new Date(b[0]) - new Date(a[0]))
          .map(([dateKey, group]) => (
            <div key={dateKey}>
              <div style={{ padding: '20px 40px 0' }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: 'var(--gray-3)', textTransform: 'uppercase', paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
                  {new Date(dateKey).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1px', background: 'var(--border)' }}>
                {group.map(r => (
                  <a key={r.id} href={r.viewUrl} target="_blank" rel="noopener noreferrer" style={{ ...cardStyle, display: 'block', color: 'inherit', textDecoration: 'none' }}
                    onMouseEnter={cardEnter}
                    onMouseLeave={cardLeave}
                  >
                    <div style={{ position: 'relative', aspectRatio: '1/1', background: 'var(--bg-2)', overflow: 'hidden' }}>
                      {r.artwork && <img src={r.artwork.replace('170x170', '300x300')} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.35s ease' }} />}
                      <div className="play-overlay" style={{ position: 'absolute', right: 10, bottom: 10, width: 28, height: 28, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#1a1400', opacity: 0, transition: 'opacity 0.2s' }}>▶</div>
                    </div>
                    <div style={{ padding: '12px 16px' }}>
                      <div style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{r.genre}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--black)', marginBottom: 2 }}>{r.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-3)' }}>{r.artist}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))
      )}
    </div>
  )
}
