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

  const cardStyle = { background: '#000', cursor: 'pointer', transition: 'background 0.2s' }

  return (
    <div>
      <div style={{ padding: '80px 40px 64px', borderBottom: '1px solid #1a1a1a' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', color: '#444', textTransform: 'uppercase', marginBottom: 20, opacity: 0, animation: 'fadeUp 0.6s 0.1s forwards' }}>Fresh drops</div>
        <h1 style={{ fontSize: 64, fontWeight: 900, letterSpacing: '-3px', lineHeight: 0.92, color: '#fff', opacity: 0, animation: 'fadeUp 0.6s 0.25s forwards' }}>New releases.</h1>
      </div>

      {recentUploads.length > 0 && (
        <>
          <div style={{ padding: '24px 40px 0', borderBottom: '1px solid #1a1a1a' }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: '#444', textTransform: 'uppercase', paddingBottom: 16 }}>Your uploads</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1px', background: '#1a1a1a', borderBottom: '1px solid #1a1a1a' }}>
            {recentUploads.map(song => (
              <div key={song.id} style={cardStyle} onClick={() => { setCurrentIndex(songs.findIndex(s => s.id === song.id)); setActiveTab('intro') }}
                onMouseEnter={e => e.currentTarget.style.background = '#0a0a0a'}
                onMouseLeave={e => e.currentTarget.style.background = '#000'}
              >
                <div style={{ aspectRatio: '1/1', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {song.cover_url ? <img src={song.cover_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 32 }}>♪</span>}
                </div>
                <div style={{ padding: '12px 16px' }}>
                  <div style={{ fontSize: 11, color: '#444', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{song.mixtape_name}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{song.title}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div style={{ padding: '24px 40px 0' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: '#444', textTransform: 'uppercase', paddingBottom: 16, borderBottom: '1px solid #1a1a1a' }}>From record labels</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1px', background: '#1a1a1a' }}>
        {loading ? <div style={{ padding: 40, color: '#333', fontSize: 14, background: '#000' }}>Loading...</div>
          : releases.map(r => (
            <a key={r.id} href={r.viewUrl} target="_blank" rel="noopener noreferrer" style={{ ...cardStyle, display: 'block', color: 'inherit', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.background = '#0a0a0a'}
              onMouseLeave={e => e.currentTarget.style.background = '#000'}
            >
              <div style={{ aspectRatio: '1/1', background: '#0a0a0a', overflow: 'hidden' }}>
                {r.artwork && <img src={r.artwork.replace('170x170', '300x300')} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </div>
              <div style={{ padding: '12px 16px' }}>
                <div style={{ fontSize: 11, color: '#444', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{r.genre}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{r.name}</div>
                <div style={{ fontSize: 12, color: '#444' }}>{r.artist}</div>
              </div>
            </a>
          ))
        }
      </div>
    </div>
  )
}
