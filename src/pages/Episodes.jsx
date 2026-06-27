import { useState, useRef } from 'react'

const EPISODES = [
  {
    id: 1,
    number: '001',
    title: 'Pilot',
    description: 'The first episode. Where it all starts.',
    duration: '45:00',
    date: 'Jun 2026',
    audioUrl: null,
  },
]

export default function Episodes() {
  const [playing, setPlaying] = useState(null)
  const audioRef = useRef(null)

  function togglePlay(ep) {
    if (!ep.audioUrl) return
    if (playing === ep.id) {
      audioRef.current.pause()
      setPlaying(null)
    } else {
      if (audioRef.current) audioRef.current.pause()
      audioRef.current.src = ep.audioUrl
      audioRef.current.play()
      setPlaying(ep.id)
    }
  }

  return (
    <div>
      <audio ref={audioRef} style={{ display: 'none' }} onEnded={() => setPlaying(null)} />

      {EPISODES.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--muted)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.1em', marginBottom: 8 }}>COMING SOON</div>
          <p style={{ fontSize: 14 }}>Episodes drop here when they're ready.</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {EPISODES.map((ep, i) => {
          const isPlaying = playing === ep.id
          return (
            <div key={ep.id} style={{
              display: 'grid',
              gridTemplateColumns: '48px 1fr auto',
              gap: 16,
              alignItems: 'center',
              padding: '1rem 0',
              borderBottom: i < EPISODES.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <button
                onClick={() => togglePlay(ep)}
                disabled={!ep.audioUrl}
                style={{
                  width: 40, height: 40,
                  borderRadius: '50%',
                  background: isPlaying ? 'var(--red)' : 'var(--gray)',
                  border: '1px solid var(--gray-light)',
                  color: 'var(--white)',
                  fontSize: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: ep.audioUrl ? 'pointer' : 'not-allowed',
                  opacity: ep.audioUrl ? 1 : 0.4,
                  transition: 'background 0.15s',
                }}
              >
                {isPlaying ? '■' : '▶'}
              </button>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--red)', letterSpacing: '0.06em' }}>
                    EP {ep.number}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>{ep.date}</span>
                </div>
                <div style={{ fontWeight: 500, fontSize: 15 }}>{ep.title}</div>
                <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{ep.description}</p>
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: 'var(--muted)' }}>
                  {ep.duration}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
