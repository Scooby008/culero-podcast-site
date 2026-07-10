import { useMemo, useState } from 'react'

// Strip "Culero Podcast NN" prefix to get the episode's place-name
function episodeName(title, trackNumber) {
  const name = (title || '').replace(/culero\s+podc?x?ast\s*\d*\s*[-–.·]*\s*/i, '').trim()
  return name || `Episode ${trackNumber ?? '?'}`
}

export default function Songs({ songs, playSong }) {
  const [query, setQuery] = useState('')

  const index = useMemo(() => {
    const out = []
    songs.forEach((ep, epIdx) => {
      if (Array.isArray(ep.tracklist)) {
        ep.tracklist.forEach((track, pos) => out.push({ track, ep, epIdx, pos }))
      }
    })
    return out
  }, [songs])

  const q = query.trim().toLowerCase()
  const results = q ? index.filter(r => r.track.toLowerCase().includes(q)) : index

  return (
    <div>
      {/* Hero */}
      <div style={{ padding: '80px 40px 48px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', color: 'var(--gray-3)', textTransform: 'uppercase', marginBottom: 20, opacity: 0, animation: 'fadeUp 0.6s 0.1s forwards', fontFamily: 'var(--mono)' }}>The index</div>
        <h1 style={{ fontSize: 64, fontWeight: 900, letterSpacing: '-3px', lineHeight: 0.92, color: 'var(--black)', marginBottom: 16, opacity: 0, animation: 'fadeUp 0.6s 0.25s forwards' }}>Every song.</h1>
        <p style={{ fontSize: 16, color: 'var(--gray-2)', opacity: 0, animation: 'fadeUp 0.6s 0.4s forwards' }}>
          {index.length.toLocaleString()} songs across {songs.filter(s => Array.isArray(s.tracklist)).length} episodes. Search it, find it, play the episode.
        </p>
      </div>

      {/* Search */}
      <div style={{ padding: '24px 40px', borderBottom: '1px solid var(--border)', position: 'sticky', top: 64, background: 'var(--bg)', zIndex: 50 }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search artists or songs — try “Bad Bunny” or “Radiohead”…"
          style={{ background: 'var(--bg-2)', border: '1px solid var(--border-strong)', color: 'var(--black)', borderRadius: 999, padding: '13px 22px', fontSize: 15, fontFamily: 'Inter, sans-serif', width: '100%', maxWidth: 560, outline: 'none', transition: 'border-color 0.2s' }}
          onFocus={e => e.target.style.borderColor = 'var(--gold)'}
          onBlur={e => e.target.style.borderColor = 'var(--border-strong)'}
        />
        {q && (
          <span style={{ marginLeft: 16, fontSize: 12, color: 'var(--gray-3)', fontFamily: 'var(--mono)' }}>
            {results.length} match{results.length === 1 ? '' : 'es'}
          </span>
        )}
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <div style={{ padding: '48px 40px', color: 'var(--gray-2)', fontSize: 14 }}>No songs match “{query}”.</div>
      ) : (
        results.map((r, i) => (
          <div key={`${r.ep.id}-${r.pos}`}
            onClick={() => playSong(r.epIdx)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '13px 40px', borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{ fontSize: 14, color: 'var(--gray-1)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.track}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
              <span style={{ fontSize: 11, color: 'var(--gray-3)', fontFamily: 'var(--mono)', letterSpacing: '0.06em' }}>
                EP {r.ep.track_number} · {episodeName(r.ep.title, r.ep.track_number)}
              </span>
              <span style={{ fontSize: 12, color: 'var(--gold)' }}>▶</span>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
