import { useEffect, useRef, useState } from 'react'
import { SUPABASE_URL, SUPABASE_ANON_KEY, R2_URL } from '../App'

export default function Intro({ songs, setSongs, currentIndex, setCurrentIndex }) {
  const audioRef = useRef(null)
  const [nowPlaying, setNowPlaying] = useState('Nothing playing yet — pick a track from the list below')
  const [isPlaying, setIsPlaying] = useState(false)
  const [upMixtape, setUpMixtape] = useState('')
  const [upTitle, setUpTitle] = useState('')
  const [upTrackNum, setUpTrackNum] = useState('')
  const [upFile, setUpFile] = useState(null)
  const [upCover, setUpCover] = useState(null)
  const [upStatus, setUpStatus] = useState('')
  const [upStatusType, setUpStatusType] = useState('')

  useEffect(() => {
    loadSongs()
  }, [])

  async function getSupabase() {
    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm')
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  }

  async function loadSongs() {
    const sb = await getSupabase()
    const { data, error } = await sb.from('songs').select('*')
      .order('mixtape_name', { ascending: true })
      .order('track_number', { ascending: true })
    if (!error) setSongs(data || [])
  }

  function playSong(index) {
    if (index < 0 || index >= songs.length) return
    setCurrentIndex(index)
    const song = songs[index]
    audioRef.current.src = song.file_url
    audioRef.current.play()
    setNowPlaying(`${song.mixtape_name} — ${song.title}`)
  }

  async function handleUpload() {
    if (!upMixtape || !upTitle || !upFile) {
      setUpStatus('Mixtape name, title, and a file are required.'); setUpStatusType('error'); return
    }
    setUpStatus('Uploading…'); setUpStatusType('')
    const sb = await getSupabase()
    const path = `${Date.now()}_${upFile.name}`
    const { error: uploadError } = await sb.storage.from('mixtape-audio').upload(path, upFile)
    if (uploadError) { setUpStatus('Upload failed: ' + uploadError.message); setUpStatusType('error'); return }
    // Use R2 for public file URL
    const fileUrl = `${R2_URL}/${path}`
    let coverUrl = null
    if (upCover) {
      const coverPath = `${Date.now()}_${upCover.name}`
      const { error: coverError } = await sb.storage.from('mixtape-covers').upload(coverPath, upCover)
      if (coverError) { setUpStatus('Cover upload failed.'); setUpStatusType('error'); return }
      const { data: cd } = sb.storage.from('mixtape-covers').getPublicUrl(coverPath)
      coverUrl = cd.publicUrl
    }
    const { error: insertError } = await sb.from('songs').insert({
      mixtape_name: upMixtape, title: upTitle,
      track_number: upTrackNum ? parseInt(upTrackNum) : null,
      file_url: fileUrl, cover_url: coverUrl,
    })
    if (insertError) { setUpStatus('File saved but DB insert failed.'); setUpStatusType('error'); return }
    setUpStatus('Track added!'); setUpStatusType('ok')
    setUpMixtape(''); setUpTitle(''); setUpTrackNum(''); setUpFile(null); setUpCover(null)
    loadSongs()
  }

  return (
    <>
      <div className="card">
        <h2>Welcome</h2>
        <p>This is a collection of mixtapes I've put together. Browse the tracklist below the player, or just hit play and let it run.</p>
      </div>

      <div className="player" style={{
        background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
        borderRadius: 16, padding: 32, textAlign: 'center',
        boxShadow: '0 0 30px rgba(0,246,255,0.08)', marginBottom: 16,
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20, position: 'relative' }}>
          <div style={{
            width: 200, height: 200, borderRadius: '50%',
            background: `
              radial-gradient(circle at 38% 35%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 12%),
              repeating-radial-gradient(circle at center, rgba(255,255,255,0.09) 0 1.5px, rgba(0,0,0,0.12) 1.5px 3px, transparent 3px 7px),
              radial-gradient(circle at center, #d8b13a 0 5%, #14141a 6% 8%, #0c0c10 9% 100%),
              radial-gradient(circle at 50% 50%, #2c2c36 0%, #15151b 75%, #050507 100%)
            `,
            boxShadow: '0 10px 24px rgba(20,20,40,0.28), inset 0 0 0 1px rgba(255,255,255,0.06)',
            position: 'relative',
            animation: 'spin 6s linear infinite',
            animationPlayState: isPlaying ? 'running' : 'paused',
          }} />
          <div style={{
            position: 'absolute', top: -14, right: 'calc(50% - 130px)',
            width: 90, height: 90,
            transformOrigin: '12px 12px',
            transform: isPlaying ? 'rotate(8deg)' : 'rotate(-28deg)',
            transition: 'transform 0.4s ease',
            zIndex: 2,
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0,
              width: 24, height: 24, borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 30%, #e8e8ee, #9a9aa6 60%, #5c5c66 100%)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.35)',
            }} />
            <div style={{
              position: 'absolute', top: 10, left: 10,
              width: 4, height: 78,
              background: 'linear-gradient(180deg, #c9c9d2, #8a8a96)',
              borderRadius: 2, transformOrigin: 'top center',
            }} />
            <div style={{
              position: 'absolute', top: 80, left: 6,
              width: 12, height: 16,
              background: 'linear-gradient(180deg, #3a3a42, #1b1b21)',
              borderRadius: 3,
            }} />
          </div>
        </div>

        <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 14, color: 'var(--accent-3)', textShadow: '0 0 10px rgba(255,215,0,0.4)' }}>
          {nowPlaying}
        </div>
        <audio ref={audioRef} controls style={{ width: '100%', marginTop: 12 }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => playSong(currentIndex + 1)}
        />
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 16 }}>
          <button onClick={() => playSong(currentIndex - 1)}>⏮ Prev</button>
          <button onClick={() => playSong(currentIndex + 1)}>Next ⏭</button>
        </div>
      </div>

      <div className="card">
        <h3>Tracklist</h3>
        {songs.length === 0
          ? <p className="muted">No episodes yet.</p>
          : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Mixtape','#','Title',''].map(h => (
                    <th key={h} style={{ textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1, color: 'var(--muted)', padding: '8px 12px', borderBottom: '2px solid var(--border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {songs.map((song, idx) => (
                  <tr key={song.id} onClick={() => playSong(idx)} style={{ cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,246,255,0.06)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--accent-3)', fontWeight: 600 }}>{song.mixtape_name}</td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--muted)', width: 60 }}>{song.track_number ?? ''}</td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontWeight: 500 }}>{song.title}</td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', textAlign: 'right', color: 'var(--accent-2)', width: 30 }}>▶</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        }
      </div>

      {(
        <div className="card">
          <h3>Add a track</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }} className="upload-grid">
            <input placeholder="Mixtape name" value={upMixtape} onChange={e => setUpMixtape(e.target.value)} />
            <input placeholder="Track title" value={upTitle} onChange={e => setUpTitle(e.target.value)} />
            <input type="number" placeholder="Track #" value={upTrackNum} onChange={e => setUpTrackNum(e.target.value)} />
            <input type="file" accept="audio/*" onChange={e => setUpFile(e.target.files[0])} />
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1, color: 'var(--muted)' }}>
              Cover art (optional)
              <input type="file" accept="image/*" onChange={e => setUpCover(e.target.files[0])} />
            </label>
          </div>
          <button className="primary" onClick={handleUpload}>Upload</button>
          {upStatus && <div className={`status-msg${upStatusType ? ' ' + upStatusType : ''}`}>{upStatus}</div>}
        </div>
      )}
    </>
  )
}
