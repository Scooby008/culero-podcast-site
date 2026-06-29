import { useEffect, useRef, useState } from 'react'
import { SUPABASE_URL, SUPABASE_ANON_KEY, R2_URL } from '../App'
import RecordLogo from '../components/RecordLogo'

export default function Intro({ songs, setSongs, currentIndex, setCurrentIndex, nowPlaying, setNowPlaying, isPlaying, setIsPlaying }) {
  const audioRef = useRef(null)
  const [upMixtape, setUpMixtape] = useState('')
  const [upTitle, setUpTitle] = useState('')
  const [upTrackNum, setUpTrackNum] = useState('')
  const [upFile, setUpFile] = useState(null)
  const [upCover, setUpCover] = useState(null)
  const [upStatus, setUpStatus] = useState('')
  const [upStatusType, setUpStatusType] = useState('')
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState('0:00')
  const [showUpload, setShowUpload] = useState(false)

  useEffect(() => { loadSongs() }, [])

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
    setIsPlaying(true)
  }

  function formatTime(s) {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  async function uploadToR2(file, folder) {
    const { AwsClient } = await import('https://esm.sh/aws4fetch')
    const R2_ACCOUNT = '545647a881b8447fba2e3b7f6869e73a'
    const R2_ACCESS_KEY = 'ae4e3d2beaa0fcf7982dbf4a67506099'
    const R2_SECRET_KEY = '84522cb873af3507ad8c53c23cf879b9c46f0097eabde54310cb48298e93d17c'
    const BUCKET = 'culero-podcast-audio'
    const aws = new AwsClient({ accessKeyId: R2_ACCESS_KEY, secretAccessKey: R2_SECRET_KEY })
    const filePath = folder + '/' + Date.now() + '_' + file.name
    const url = 'https://' + R2_ACCOUNT + '.r2.cloudflarestorage.com/' + BUCKET + '/' + filePath
    const res = await aws.fetch(url, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file })
    if (!res.ok) throw new Error('R2 upload failed: ' + res.status)
    return R2_URL + '/' + filePath
  }

  async function handleUpload() {
    if (!upMixtape || !upTitle || !upFile) { setUpStatus('Mixtape name, title, and file are required.'); setUpStatusType('error'); return }
    setUpStatus('Uploading audio...'); setUpStatusType('')
    let fileUrl, coverUrl = null
    try { fileUrl = await uploadToR2(upFile, 'audio') }
    catch (e) { setUpStatus('Upload failed: ' + e.message); setUpStatusType('error'); return }
    if (upCover) {
      setUpStatus('Uploading cover...')
      try { coverUrl = await uploadToR2(upCover, 'covers') }
      catch (e) { setUpStatus('Cover upload failed.'); setUpStatusType('error'); return }
    }
    setUpStatus('Saving...')
    const sb = await getSupabase()
    const { error } = await sb.from('songs').insert({
      mixtape_name: upMixtape, title: upTitle,
      track_number: upTrackNum ? parseInt(upTrackNum) : null,
      file_url: fileUrl, cover_url: coverUrl,
    })
    if (error) { setUpStatus('DB save failed: ' + error.message); setUpStatusType('error'); return }
    setUpStatus('Track added!'); setUpStatusType('ok')
    setUpMixtape(''); setUpTitle(''); setUpTrackNum(''); setUpFile(null); setUpCover(null)
    loadSongs()
  }

  const inputStyle = {
    background: 'var(--bg-2)', border: '1px solid var(--border-strong)', color: 'var(--black)',
    borderRadius: 8, padding: '10px 14px', fontSize: 14,
    fontFamily: 'Inter, sans-serif', width: '100%',
    outline: 'none', transition: 'border-color 0.2s',
  }

  return (
    <div>
      {/* Hero */}
      <div style={{ padding: '80px 40px 64px', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden', minHeight: 340 }}>
        <div style={{ position: 'absolute', right: 60, top: '50%', transform: 'translateY(-50%)', opacity: 0.15, pointerEvents: 'none' }}>
          <RecordLogo size={280} spinning={isPlaying} />
        </div>
        <div style={{ opacity: 0, animation: 'fadeUp 0.6s 0.1s forwards' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', color: 'var(--gray-3)', textTransform: 'uppercase', marginBottom: 20 }}>
            Chicago · Independent
          </div>
        </div>
        <div style={{ opacity: 0, animation: 'fadeUp 0.6s 0.25s forwards' }}>
          <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1.1, color: 'var(--black)', marginBottom: 24 }}>
            Music is the shorthand<br />of emotion.
          </h1>
          <div style={{ fontSize: 13, color: 'var(--gray-3)', fontStyle: 'italic', marginTop: 12, marginBottom: 24 }}>— Tolstoy</div>
        </div>
        <div style={{ opacity: 0, animation: 'fadeUp 0.6s 0.4s forwards' }}>
          <p style={{ fontSize: 16, color: 'var(--gray-2)', maxWidth: 380, lineHeight: 1.6, marginBottom: 36 }}>
            A collection of mixtapes curated from Chicago. Browse the tracklist or just hit play and let it run.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, opacity: 0, animation: 'fadeUp 0.6s 0.55s forwards' }}>
          <button
            onClick={() => playSong(0)}
            style={{ background: 'var(--black)', color: 'var(--black)', border: 'none', borderRadius: '999px', padding: '13px 28px', fontSize: 14, fontWeight: 700, transition: 'transform 0.15s, background 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.background = '#e8e8e8' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'var(--black)' }}
          >▶ Play now</button>
          <button
            onClick={() => setShowUpload(s => !s)}
            style={{ background: 'transparent', color: 'var(--black)', border: '1px solid var(--border-strong)', borderRadius: '999px', padding: '13px 28px', fontSize: 14, fontWeight: 600, transition: 'border-color 0.15s, transform 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#666'; e.currentTarget.style.transform = 'scale(1.04)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.transform = 'scale(1)' }}
          >+ Add track</button>
        </div>
      </div>

      {/* Now playing bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '16px 40px', borderBottom: '1px solid var(--border)', background: 'var(--bg-2)' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: isPlaying ? 'var(--black)' : '#333', flexShrink: 0, animation: isPlaying ? 'pulse 2s infinite' : 'none' }} />
        <div style={{ minWidth: 200 }}>
          <div style={{ fontSize: 10, color: 'var(--gray-3)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Now playing</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--black)', marginTop: 2 }}>{nowPlaying || 'Pick a track to begin'}</div>
        </div>
        <div style={{ flex: 1, height: 1, background: 'var(--border)', borderRadius: 1, position: 'relative', cursor: 'pointer' }}
          onClick={e => {
            const rect = e.currentTarget.getBoundingClientRect()
            const pct = (e.clientX - rect.left) / rect.width
            if (audioRef.current && audioRef.current.duration) audioRef.current.currentTime = pct * audioRef.current.duration
          }}
        >
          <div style={{ width: progress + '%', height: '100%', background: 'var(--black)', borderRadius: 1, transition: 'width 0.1s' }} />
        </div>
        <div style={{ fontSize: 12, color: 'var(--gray-3)', fontVariantNumeric: 'tabular-nums', minWidth: 36 }}>{currentTime}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => playSong(currentIndex - 1)} style={{ background: 'none', border: '1px solid var(--border-strong)', borderRadius: '999px', color: 'var(--gray-2)', padding: '6px 12px', fontSize: 12, transition: 'color 0.15s, border-color 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--black)'; e.currentTarget.style.borderColor = '#444' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#666'; e.currentTarget.style.borderColor = '#222' }}
          >⏮</button>
          <button onClick={() => playSong(currentIndex + 1)} style={{ background: 'none', border: '1px solid var(--border-strong)', borderRadius: '999px', color: 'var(--gray-2)', padding: '6px 12px', fontSize: 12, transition: 'color 0.15s, border-color 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--black)'; e.currentTarget.style.borderColor = '#444' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#666'; e.currentTarget.style.borderColor = '#222' }}
          >⏭</button>
        </div>
      </div>

      <audio ref={audioRef} style={{ display: 'none' }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => { setIsPlaying(false); playSong(currentIndex + 1) }}
        onTimeUpdate={() => {
          if (!audioRef.current) return
          const { currentTime: ct, duration } = audioRef.current
          if (duration) setProgress((ct / duration) * 100)
          setCurrentTime(formatTime(ct))
        }}
      />

      {/* Upload panel */}
      {showUpload && (
        <div style={{ padding: '32px 40px', borderBottom: '1px solid var(--border)', background: 'var(--bg-2)', animation: 'fadeUp 0.3s ease forwards' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--black)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 20 }}>Add a track</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px', gap: 10, marginBottom: 10 }}>
            <input style={inputStyle} placeholder="Mixtape name" value={upMixtape} onChange={e => setUpMixtape(e.target.value)}
              onFocus={e => e.target.style.borderColor = '#444'} onBlur={e => e.target.style.borderColor = '#222'} />
            <input style={inputStyle} placeholder="Track title" value={upTitle} onChange={e => setUpTitle(e.target.value)}
              onFocus={e => e.target.style.borderColor = '#444'} onBlur={e => e.target.style.borderColor = '#222'} />
            <input type="number" style={inputStyle} placeholder="Track #" value={upTrackNum} onChange={e => setUpTrackNum(e.target.value)}
              onFocus={e => e.target.style.borderColor = '#444'} onBlur={e => e.target.style.borderColor = '#222'} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            <label style={{ ...inputStyle, cursor: 'pointer', color: upFile ? 'var(--black)' : '#444' }}>
              {upFile ? '✓ ' + upFile.name : 'Select audio file (.mp3)'}
              <input type="file" accept="audio/*" style={{ display: 'none' }} onChange={e => setUpFile(e.target.files[0])} />
            </label>
            <label style={{ ...inputStyle, cursor: 'pointer', color: upCover ? 'var(--black)' : '#444' }}>
              {upCover ? '✓ ' + upCover.name : 'Cover art (optional)'}
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setUpCover(e.target.files[0])} />
            </label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={handleUpload} style={{ background: 'var(--black)', color: 'var(--black)', border: 'none', borderRadius: '999px', padding: '11px 24px', fontSize: 13, fontWeight: 700, transition: 'transform 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >Upload</button>
            {upStatus && <span style={{ fontSize: 13, color: upStatusType === 'ok' ? '#5aea8a' : upStatusType === 'error' ? '#ff5555' : '#666' }}>{upStatus}</span>}
          </div>
        </div>
      )}

      {/* Tracklist */}
      <div style={{ borderBottom: '1px solid var(--border)' }}>
        <div style={{ padding: '20px 40px 0' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: 'var(--gray-3)', textTransform: 'uppercase', paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
            Tracklist
          </div>
        </div>
        {songs.length === 0 ? (
          <div style={{ padding: '48px 40px', color: 'var(--gray-1)', fontSize: 14 }}>No tracks yet. Add one above.</div>
        ) : songs.map((song, idx) => (
          <div key={song.id}
            onClick={() => playSong(idx)}
            style={{ display: 'grid', gridTemplateColumns: '40px 1fr auto', alignItems: 'center', gap: 16, padding: '16px 40px', borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'background 0.15s', background: currentIndex === idx ? '#0d0d0d' : 'transparent' }}
            onMouseEnter={e => e.currentTarget.style.background = '#0d0d0d'}
            onMouseLeave={e => { if (currentIndex !== idx) e.currentTarget.style.background = 'transparent' }}
          >
            <span style={{ fontSize: 12, color: 'var(--gray-1)', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{String(idx + 1).padStart(2, '0')}</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: currentIndex === idx ? 'var(--black)' : '#ccc' }}>{song.title}</div>
              <div style={{ fontSize: 12, color: 'var(--gray-3)', marginTop: 2 }}>{song.mixtape_name}</div>
            </div>
            <span style={{ fontSize: 13, color: 'var(--gray-1)' }}>{currentIndex === idx && isPlaying ? '▶' : '›'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
