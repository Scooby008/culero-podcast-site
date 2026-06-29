import { useState, useRef } from 'react'

const STATIONS = [
  { id: 'kexp', name: 'KEXP', location: 'Seattle, WA', desc: 'Independent music discovery — genre-defying and listener-supported since 1972.', url: 'https://kexp.streamguys1.com/kexp160.aac' },
  { id: 'kcrw', name: 'KCRW', location: 'Santa Monica, CA', desc: "Eclectic music, NPR news, and culture from LA's iconic public radio station.", url: 'https://kcrw.streamguys1.com/kcrw_192k_mp3_on_air' },
  { id: 'r1', name: 'BBC Radio 1', location: 'London, UK', desc: "Chart hits, new music, and live events from the UK's biggest pop station.", bbcUrl: 'https://www.bbc.co.uk/sounds/play/live:bbc_radio_one' },
  { id: 'r6', name: 'BBC Radio 6', location: 'London, UK', desc: 'Alternative, indie, and eclectic music curated by world-class DJs.', bbcUrl: 'https://www.bbc.co.uk/sounds/play/live:bbc_6music' },
]

export default function Radio() {
  const [playing, setPlaying] = useState(null)
  const audioRef = useRef(null)

  function play(s) {
    if (s.bbcUrl) { window.open(s.bbcUrl, '_blank'); return }
    if (playing === s.id) { audioRef.current.pause(); audioRef.current.src = ''; setPlaying(null); return }
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = '' }
    audioRef.current.src = s.url
    audioRef.current.play().catch(() => {})
    setPlaying(s.id)
  }

  return (
    <div>
      <audio ref={audioRef} style={{ display: 'none' }} onEnded={() => setPlaying(null)} />

      {/* Hero */}
      <div style={{ padding: '80px 40px 64px', borderBottom: '1px solid #1a1a1a' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', color: '#444', textTransform: 'uppercase', marginBottom: 20, opacity: 0, animation: 'fadeUp 0.6s 0.1s forwards' }}>Live radio</div>
        <h1 style={{ fontSize: 64, fontWeight: 900, letterSpacing: '-3px', lineHeight: 0.92, color: '#fff', marginBottom: 16, opacity: 0, animation: 'fadeUp 0.6s 0.25s forwards' }}>Tune in.</h1>
        <p style={{ fontSize: 16, color: '#555', opacity: 0, animation: 'fadeUp 0.6s 0.4s forwards' }}>Four stations. One click. No filler.</p>
      </div>

      {playing && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 40px', background: '#0a0a0a', borderBottom: '1px solid #1a1a1a' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{STATIONS.find(s => s.id === playing)?.name}</span>
          <span style={{ fontSize: 11, color: '#444', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Live</span>
          <button onClick={() => play(STATIONS.find(s => s.id === playing))} style={{ marginLeft: 'auto', background: 'none', border: '1px solid #333', borderRadius: '999px', color: '#666', padding: '6px 14px', fontSize: 12, transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#666' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#666'; e.currentTarget.style.borderColor = '#333' }}
          >Stop</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#1a1a1a' }}>
        {STATIONS.map(s => (
          <div key={s.id}
            style={{ background: '#000', padding: '36px 40px', cursor: 'pointer', transition: 'background 0.2s', borderLeft: playing === s.id ? '2px solid #fff' : '2px solid transparent' }}
            onMouseEnter={e => e.currentTarget.style.background = '#0a0a0a'}
            onMouseLeave={e => e.currentTarget.style.background = '#000'}
          >
            <div style={{ fontSize: 11, color: '#333', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>{s.location}</div>
            <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-1px', color: '#fff', marginBottom: 10 }}>{s.name}</div>
            <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6, marginBottom: 24 }}>{s.desc}</p>
            <button onClick={() => play(s)}
              style={{ background: playing === s.id ? '#fff' : 'transparent', color: playing === s.id ? '#000' : '#fff', border: '1px solid #333', borderRadius: '999px', padding: '10px 20px', fontSize: 12, fontWeight: 700, transition: 'all 0.2s', letterSpacing: '0.04em' }}
              onMouseEnter={e => { if (playing !== s.id) { e.currentTarget.style.borderColor = '#666'; e.currentTarget.style.background = '#111' } }}
              onMouseLeave={e => { if (playing !== s.id) { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.background = 'transparent' } }}
            >
              {s.bbcUrl ? '↗ BBC Sounds' : playing === s.id ? '■ Stop' : '▶ Play'}
            </button>
            {s.bbcUrl && <div style={{ fontSize: 11, color: '#333', marginTop: 10 }}>Opens BBC Sounds — BBC blocks third-party embeds</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
