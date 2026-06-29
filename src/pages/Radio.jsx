import { useState, useRef } from 'react'

const STATIONS = [
  { id: 'kexp', name: 'KEXP', location: 'Seattle, WA', desc: 'Independent music discovery — genre-defying and listener-supported since 1972.', url: 'https://kexp.streamguys1.com/kexp160.aac' },
  { id: 'kcrw', name: 'KCRW', location: 'Santa Monica, CA', desc: "Eclectic music, NPR news, and culture from LA's iconic public radio station.", url: 'https://kcrw.streamguys1.com/kcrw_192k_mp3_on_air' },
  { id: 'triplej', name: 'Triple J', location: 'Sydney, Australia', desc: "Australia's national youth radio — alternative, indie, and the best new music from down under.", url: 'https://live-radio01.mediahubaustralia.com/2TJW/mp3/' },
  { id: 'thelot', name: 'The Lot Radio', location: 'Brooklyn, NY', desc: 'DJ sets from a repurposed shipping container on an empty lot in NYC. Underground and varied.', url: 'https://livepeercdn.studio/hls/85c28sa2o8wppm58/index.m3u8' },
  { id: 'boogaloo', name: 'Boogaloo Radio', location: 'London, UK', desc: "The world's first pub radio station. Rock, soul, and indie from North London's famous Boogaloo.", url: 'https://streams.radio.co/sb88c742f0/listen' },
  { id: 'buenavida', name: 'Radio Buena Vida', location: 'Glasgow, Scotland', desc: 'Community radio from a Glasgow record cafe. Experimental to disco to jungle, 24/7.', url: 'https://radiobuenavida.out.airtime.pro/radiobuenavida_a' },
  { id: 'dublin', name: 'Dublin Digital Radio', location: 'Dublin, Ireland', desc: 'Volunteer-run community radio with 175+ residents. Music, art, and politics from Dublin.', url: 'https://dublin-digital-radio.radiocult.fm/stream' },
  { id: 'worm', name: 'Radio Worm', location: 'Rotterdam, Netherlands', desc: 'Experimental and underground sounds from the heart of WORM arts centre. 80+ resident shows.', url: 'https://worm.streamnerd.nl/listen/worm/radio.mp3' },
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
      <div style={{ padding: '80px 40px 64px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', color: 'var(--gray-3)', textTransform: 'uppercase', marginBottom: 20, opacity: 0, animation: 'fadeUp 0.6s 0.1s forwards' }}>Live radio</div>
        <h1 style={{ fontSize: 64, fontWeight: 900, letterSpacing: '-3px', lineHeight: 0.92, color: 'var(--black)', marginBottom: 16, opacity: 0, animation: 'fadeUp 0.6s 0.25s forwards' }}>Tune in.</h1>
        <p style={{ fontSize: 16, color: 'var(--gray-2)', opacity: 0, animation: 'fadeUp 0.6s 0.4s forwards' }}>Four stations. One click. No filler.</p>
      </div>

      {playing && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 40px', background: 'var(--bg-2)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--black)', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--black)' }}>{STATIONS.find(s => s.id === playing)?.name}</span>
          <span style={{ fontSize: 11, color: 'var(--gray-3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Live</span>
          <button onClick={() => play(STATIONS.find(s => s.id === playing))} style={{ marginLeft: 'auto', background: 'none', border: '1px solid var(--border-strong)', borderRadius: '999px', color: 'var(--gray-2)', padding: '6px 14px', fontSize: 12, transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--black)'; e.currentTarget.style.borderColor = '#666' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#666'; e.currentTarget.style.borderColor = '#333' }}
          >Stop</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1px', background: 'var(--border)' }}>
        {STATIONS.map(s => (
          <div key={s.id}
            style={{ background: 'var(--bg)', padding: '36px 40px', cursor: 'pointer', transition: 'background 0.2s', borderLeft: playing === s.id ? '2px solid #fff' : '2px solid transparent' }}
            onMouseEnter={e => e.currentTarget.style.background = '#0a0a0a'}
            onMouseLeave={e => e.currentTarget.style.background = '#000'}
          >
            <div style={{ fontSize: 11, color: 'var(--gray-1)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>{s.location}</div>
            <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-1px', color: 'var(--black)', marginBottom: 10 }}>{s.name}</div>
            <p style={{ fontSize: 13, color: 'var(--gray-2)', lineHeight: 1.6, marginBottom: 24 }}>{s.desc}</p>
            <button onClick={() => play(s)}
              style={{ background: playing === s.id ? 'var(--black)' : 'transparent', color: playing === s.id ? '#000' : 'var(--black)', border: '1px solid var(--border-strong)', borderRadius: '999px', padding: '10px 20px', fontSize: 12, fontWeight: 700, transition: 'all 0.2s', letterSpacing: '0.04em' }}
              onMouseEnter={e => { if (playing !== s.id) { e.currentTarget.style.borderColor = '#666'; e.currentTarget.style.background = '#111' } }}
              onMouseLeave={e => { if (playing !== s.id) { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.background = 'transparent' } }}
            >
              {s.bbcUrl ? '↗ BBC Sounds' : playing === s.id ? '■ Stop' : '▶ Play'}
            </button>
            {s.bbcUrl && <div style={{ fontSize: 11, color: 'var(--gray-1)', marginTop: 10 }}>Opens BBC Sounds — BBC blocks third-party embeds</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
