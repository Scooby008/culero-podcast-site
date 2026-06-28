import { useEffect, useState } from 'react'

const LABEL_GENRES = [
  { id: 18, name: 'Hip Hop' },
  { id: 21, name: 'Rock' },
  { id: 14, name: 'Pop' },
  { id: 7, name: 'Electronic' },
  { id: 17, name: 'EDM' },
]

function escapeHtml(str) {
  const d = document.createElement('div'); d.textContent = str; return d.innerHTML
}

export default function NewReleases({ songs, setCurrentIndex, setActiveTab }) {
  const [labelReleases, setLabelReleases] = useState([])
  const [loading, setLoading] = useState(true)

  const cutoff = new Date()
  cutoff.setMonth(cutoff.getMonth() - 2)
  const recentUploads = songs.filter(s => new Date(s.created_at) >= cutoff)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  useEffect(() => {
    loadLabelReleases()
  }, [])

  async function loadLabelReleases() {
    try {
      const resultsByGenre = await Promise.all(
        LABEL_GENRES.map(async (genre) => {
          const url = `https://itunes.apple.com/us/rss/topalbums/limit=100/genre=${genre.id}/json`
          const res = await fetch(url)
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
            genreTag: genre.name,
          }))
        })
      )
      const seen = new Set()
      const releases = []
      resultsByGenre.flat().forEach(r => {
        if (!r.releaseDate) return
        if (new Date(r.releaseDate) < cutoff) return
        if (seen.has(r.id)) return
        seen.add(r.id)
        releases.push(r)
      })
      releases.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
      setLabelReleases(releases)
    } catch {}
    setLoading(false)
  }

  const cardStyle = {
    display: 'block', background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--border)', borderRadius: 12,
    overflow: 'hidden', cursor: 'pointer', color: 'inherit', textDecoration: 'none',
    transition: 'transform 0.15s, box-shadow 0.15s',
  }

  return (
    <>
      <div className="card">
        <h2>Your Uploads</h2>
        <p className="muted">Tracks added in the last 2 months.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 18, marginBottom: 24 }}>
        {recentUploads.length === 0
          ? <p className="muted">No new releases in the last 2 months.</p>
          : recentUploads.map(song => (
            <div key={song.id} style={cardStyle}
              onClick={() => { const idx = songs.findIndex(s => s.id === song.id); setCurrentIndex(idx); setActiveTab('intro') }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 0 20px rgba(0,246,255,0.25)' }}
              onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='' }}
            >
              <div style={{ width:'100%', aspectRatio:'1/1', background:'linear-gradient(135deg,#262a35,#1b1d24)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                {song.cover_url ? <img src={song.cover_url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <span className="muted" style={{ fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:1 }}>No Cover</span>}
              </div>
              <div style={{ padding:'10px 12px' }}>
                <div style={{ color:'var(--accent-3)', fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:1 }}>{song.mixtape_name}</div>
                <div style={{ fontWeight:600, marginTop:2, fontSize:'0.9rem' }}>{song.title}</div>
                <div className="muted" style={{ fontSize:'0.7rem', marginTop:6 }}>{new Date(song.created_at).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'})}</div>
              </div>
            </div>
          ))
        }
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h2>From Record Labels</h2>
        <p className="muted">New releases from the last 2 months in Hip Hop, Rock, Pop, Electronic, and EDM, via the iTunes Search API.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 18 }}>
        {loading
          ? <p className="muted">Loading…</p>
          : labelReleases.length === 0
            ? <p className="muted">No label releases found.</p>
            : labelReleases.map(r => (
              <a key={r.id} href={r.viewUrl} target="_blank" rel="noopener noreferrer" style={cardStyle}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 0 20px rgba(0,246,255,0.25)' }}
                onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='' }}
              >
                <div style={{ width:'100%', aspectRatio:'1/1', background:'linear-gradient(135deg,#262a35,#1b1d24)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                  {r.artwork ? <img src={r.artwork.replace('170x170','300x300')} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <span className="muted" style={{ fontSize:'0.7rem' }}>No Cover</span>}
                </div>
                <div style={{ padding:'10px 12px' }}>
                  <div style={{ color:'var(--accent-3)', fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:1 }}>{r.genreTag}</div>
                  <div style={{ fontWeight:600, marginTop:2, fontSize:'0.9rem' }}>{r.name}</div>
                  <div className="muted" style={{ fontSize:'0.7rem', marginTop:6 }}>{r.artist} — {new Date(r.releaseDate).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'})}</div>
                </div>
              </a>
            ))
        }
      </div>
    </>
  )
}
