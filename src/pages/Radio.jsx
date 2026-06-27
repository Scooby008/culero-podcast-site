import { useState, useRef } from 'react'

const STATIONS = [
  {
    id: 'kexp',
    name: 'KEXP',
    location: 'Seattle, WA',
    desc: 'Independent music discovery — genre-defying and listener-supported since 1972.',
    url: 'https://kexp.streamguys1.com/kexp160.aac',
    bbcUrl: null,
  },
  {
    id: 'kcrw',
    name: 'KCRW',
    location: 'Santa Monica, CA',
    desc: 'Eclectic music, NPR news, and culture from LA\'s iconic public radio station.',
    url: 'https://kcrw.streamguys1.com/kcrw_192k_mp3_on_air',
    bbcUrl: null,
  },
  {
    id: 'r1',
    name: 'BBC Radio 1',
    location: 'London, UK',
    desc: 'Chart hits, new music, and live events from the UK\'s biggest pop station.',
    url: null,
    bbcUrl: 'https://www.bbc.co.uk/sounds/play/live:bbc_radio_one',
  },
  {
    id: 'r6',
    name: 'BBC Radio 6 Music',
    location: 'London, UK',
    desc: 'Alternative, indie, and eclectic music curated by world-class DJs.',
    url: null,
    bbcUrl: 'https://www.bbc.co.uk/sounds/play/live:bbc_6music',
  },
]

export default function Radio() {
  const [playing, setPlaying] = useState(null)
  const audioRef = useRef(null)

  function play(station) {
    if (station.bbcUrl) {
      window.open(station.bbcUrl, '_blank')
      return
    }
    if (playing === station.id) {
      audioRef.current.pause()
      audioRef.current.src = ''
      setPlaying(null)
      return
    }
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
    }
    audioRef.current.src = station.url
    audioRef.current.play().catch(() => {})
    setPlaying(station.id)
  }

  const nowPlaying = STATIONS.find(s => s.id === playing)

  return (
    <div>
      <audio ref={audioRef} style={{ display: 'none' }}
        onEnded={() => setPlaying(null)}
      />

      {nowPlaying && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16,
          background: 'var(--gray)', border: '1px solid var(--red-dim)',
          borderRadius: 'var(--radius)', padding: '0.85rem 1.25rem',
          marginBottom: '1.5rem',
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--red)', flexShrink: 0,
            animation: 'pulse 1.5s infinite',
          }} />
          <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.08em', fontFamily: 'var(--font-display)' }}>LIVE</div>
            <div style={{ fontSize: 15, fontWeight: 500 }}>{nowPlaying.name}</div>
          </div>
          <button onClick={() => play(nowPlaying)} style={{
            background: 'none', border: '1px solid var(--gray-light)',
            color: 'var(--muted)', borderRadius: 'var(--radius)',
            padding: '4px 12px', fontSize: 12,
          }}>
            Stop
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
        {STATIONS.map(station => {
          const isPlaying = playing === station.id
          return (
            <div key={station.id} style={{
              background: 'var(--gray)',
              border: isPlaying ? '1px solid var(--red)' : '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '1.1rem 1.25rem',
              transition: 'border-color 0.15s',
            }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-display)', letterSpacing: '0.06em', marginBottom: 6 }}>
                {station.location.toUpperCase()}
              </div>
              <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 6 }}>{station.name}</div>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 14 }}>{station.desc}</p>
              <button
                onClick={() => play(station)}
                style={{
                  background: isPlaying ? 'var(--red)' : 'none',
                  border: `1px solid ${isPlaying ? 'var(--red)' : 'var(--gray-light)'}`,
                  color: isPlaying ? '#fff' : 'var(--white)',
                  borderRadius: 'var(--radius)',
                  padding: '6px 14px',
                  fontSize: 12,
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.06em',
                  display: 'flex', alignItems: 'center', gap: 6,
                  transition: 'all 0.15s',
                }}
              >
                {station.bbcUrl ? '↗ BBC SOUNDS' : isPlaying ? '■ STOP' : '▶ PLAY'}
              </button>
              {station.bbcUrl && (
                <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8 }}>
                  BBC blocks third-party embeds — opens in BBC Sounds
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
