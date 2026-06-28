import { useState, useRef } from 'react'

const STATIONS = [
  { id: 'kexp', name: 'KEXP', location: 'Seattle, WA', desc: 'Independent music discovery — genre-defying and listener-supported since 1972.', url: 'https://kexp.streamguys1.com/kexp160.aac', bbcUrl: null },
  { id: 'kcrw', name: 'KCRW', location: 'Santa Monica, CA', desc: "Eclectic music, NPR news, and culture from LA's iconic public radio station.", url: 'https://kcrw.streamguys1.com/kcrw_192k_mp3_on_air', bbcUrl: null },
  { id: 'r1', name: 'BBC Radio 1', location: 'London, UK', desc: "Chart hits, new music, and live events from the UK's biggest pop station.", url: null, bbcUrl: 'https://www.bbc.co.uk/sounds/play/live:bbc_radio_one' },
  { id: 'r6', name: 'BBC Radio 6 Music', location: 'London, UK', desc: 'Alternative, indie, and eclectic music curated by world-class DJs.', url: null, bbcUrl: 'https://www.bbc.co.uk/sounds/play/live:bbc_6music' },
]

export default function Radio() {
  const [playing, setPlaying] = useState(null)
  const audioRef = useRef(null)

  function play(station) {
    if (station.bbcUrl) { window.open(station.bbcUrl, '_blank'); return }
    if (playing === station.id) {
      audioRef.current.pause(); audioRef.current.src = ''; setPlaying(null); return
    }
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = '' }
    audioRef.current.src = station.url
    audioRef.current.play().catch(() => {})
    setPlaying(station.id)
  }

  const nowPlaying = STATIONS.find(s => s.id === playing)

  return (
    <>
      <audio ref={audioRef} style={{ display: 'none' }} onEnded={() => setPlaying(null)} />

      {nowPlaying && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16,
          background: 'rgba(255,255,255,0.05)', border: '1px solid var(--accent)',
          borderRadius: 12, padding: '14px 20px', marginBottom: 16,
          boxShadow: '0 0 20px rgba(255,42,212,0.15)',
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-2)', flexShrink: 0, animation: 'pulse 1.5s infinite' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Live</div>
            <div style={{ fontWeight: 600, color: 'var(--accent-2)', textShadow: '0 0 8px var(--accent-2)' }}>{nowPlaying.name}</div>
          </div>
          <button onClick={() => play(nowPlaying)} style={{ fontSize: '0.75rem', padding: '6px 14px' }}>Stop</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
        {STATIONS.map(station => {
          const isPlaying = playing === station.id
          return (
            <div key={station.id} style={{
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid ${isPlaying ? 'var(--accent-2)' : 'var(--border)'}`,
              borderRadius: 12, padding: '18px 20px',
              boxShadow: isPlaying ? '0 0 20px rgba(0,246,255,0.2)' : 'none',
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
                {station.location}
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-2)', textShadow: isPlaying ? '0 0 10px var(--accent-2)' : 'none', marginBottom: 6 }}>
                {station.name}
              </div>
              <p className="muted" style={{ fontSize: '0.85rem', lineHeight: 1.5, marginBottom: 14 }}>{station.desc}</p>
              <button
                onClick={() => play(station)}
                className={isPlaying ? 'primary' : ''}
                style={{ fontSize: '0.75rem', padding: '6px 14px', letterSpacing: '0.08em' }}
              >
                {station.bbcUrl ? '↗ BBC Sounds' : isPlaying ? '■ Stop' : '▶ Play'}
              </button>
              {station.bbcUrl && <p className="muted" style={{ fontSize: '0.7rem', marginTop: 8 }}>BBC blocks third-party embeds — opens BBC Sounds</p>}
            </div>
          )
        })}
      </div>
    </>
  )
}
