import { useEffect, useRef, useState } from 'react'
import { SUPABASE_URL, SUPABASE_ANON_KEY, R2_URL } from '../App'
import RecordLogo from '../components/RecordLogo'
import Equalizer from '../components/Equalizer'
import { extractDominantColor } from '../lib/color'

const ACCESS_PASSWORD = 'Enjoy'
const MAX_UPLOAD_MB = 150
const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024

export default function Intro({ songs, setSongs, currentIndex, setCurrentIndex, nowPlaying, setNowPlaying, isPlaying, setIsPlaying, listenUnlocked, setListenUnlocked }) {
  const audioRef = useRef(null)
  const [pwInput, setPwInput] = useState('')
  const [pwError, setPwError] = useState('')
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
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [nowPlayingCover, setNowPlayingCover] = useState(null)
  const [accentColor, setAccentColor] = useState(null)

  function handleUnlock() {
    if (pwInput === ACCESS_PASSWORD) {
      sessionStorage.setItem('culero_access', 'true')
      setListenUnlocked(true)
      sessionStorage.setItem('culero_access', 'true')
      setPwError('')
    } else {
      setPwError('Incorrect password.')
      setPwInput('')
    }
  }

  function stopSong() {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current.src = ''
    }
    setIsPlaying(false)
    setNowPlaying(null)
    setProgress(0)
    setCurrentTime('0:00')
    setNowPlayingCover(null)
    setAccentColor(null)
  }

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

  function startEdit(e, song) {
    e.stopPropagation()
    setEditingId(song.id)
    setEditValue(song.title)
  }

  function cancelEdit(e) {
    if (e) e.stopPropagation()
    setEditingId(null)
    setEditValue('')
  }

  async function saveEdit(e, id) {
    if (e) e.stopPropagation()
    const trimmed = editValue.trim()
    if (!trimmed) return
    const sb = await getSupabase()
    const { error } = await sb.from('songs').update({ title: trimmed }).eq('id', id)
    if (!error) {
      setEditingId(null)
      setEditValue('')
      loadSongs()
    }
  }

  function playSong(index) {
    if (index < 0 || index >= songs.length) return
    setCurrentIndex(index)
    const song = songs[index]
    audioRef.current.src = song.file_url
    audioRef.current.play()
    setNowPlaying(`${song.mixtape_name} — ${song.title}`)
    setIsPlaying(true)
    setNowPlayingCover(song.cover_url || null)
    setAccentColor(null)
    if (song.cover_url) {
      extractDominantColor(song.cover_url).then(rgb => setAccentColor(rgb))
    }
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
    if (upFile.size > MAX_UPLOAD_BYTES) { setUpStatus(`File is too large (${(upFile.size / (1024 * 1024)).toFixed(1)}MB). Max size is ${MAX_UPLOAD_MB}MB.`); setUpStatusType('error'); return }
    setUploading(true)
    try {
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
    } finally {
      setUploading(false)
    }
  }

  async function readTrackTitleFromMetadata(file) {
    try {
      const { parseBlob } = await import('https://esm.sh/music-metadata-browser@2/+esm')
      const meta = await parseBlob(file)
      const title = meta?.common?.title
      if (title) return title
    } catch { }
    return file.name.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ').trim()
  }

  const inputStyle = {
    background: 'var(--bg-2)', border: '1px solid var(--border-strong)', color: 'var(--black)',
    borderRadius: 8, padding: '10px 14px', fontSize: 14,
    fontFamily: 'Inter, sans-serif', width: '100%',
    outline: 'none', transition: 'border-color 0.2s',
  }

  if (!listenUnlocked) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '40px' }}>
        <div style={{ width: '100%', maxWidth: 380, textAlign: 'center' }}>
          <RecordLogo size={56} />
          <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.5px', color: 'var(--black)', margin: '20px 0 8px' }}>
            Members only
          </h2>
          <p style={{ fontSize: 14, color: 'var(--gray-2)', marginBottom: 28, lineHeight: 1.6 }}>
            Enter the password to access the music player.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input
              type="password"
              placeholder="Password"
              value={pwInput}
              onChange={e => setPwInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleUnlock()}
              style={{
                background: 'var(--bg-2)', border: '1px solid var(--border-strong)',
                color: 'var(--black)', borderRadius: 8, padding: '12px 16px',
                fontSize: 15, fontFamily: 'Inter, sans-serif', outline: 'none',
                textAlign: 'center', letterSpacing: '0.1em',
              }}
              autoFocus
            />
            {pwError && <p style={{ fontSize: 13, color: '#c0392b', margin: 0 }}>{pwError}</p>}
            <button
              onClick={handleUnlock}
              style={{
                background: 'var(--black)', color: '#fff', border: 'none',
                borderRadius: '999px', padding: '13px 28px', fontSize: 14,
                fontWeight: 700, transition: 'transform 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              Enter
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Hero */}
      <div style={{ padding: '80px 40px 64px', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden', minHeight: 340 }}>
        <div style={{ position: 'absolute', right: 60, top: '50%', transform: 'translateY(-50%)', opacity: 0.15, pointerEvents: 'none' }}>
          <RecordLogo size={420} spinning={isPlaying} accentColor={accentColor} />
        </div>
        <div style={{ opacity: 0, animation: 'fadeUp 0.6s 0.1s forwards' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', color: 'var(--gray-3)', textTransform: 'uppercase', marginBottom: 20, fontFamily: 'var(--mono)' }}>
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
            style={{ background: 'var(--black)', color: '#fff', border: 'none', borderRadius: '999px', padding: '13px 28px', fontSize: 14, fontWeight: 700, transition: 'transform 0.15s, background 0.15s' }}
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
      <div style={{ padding: '14px 40px', borderBottom: '1px solid var(--border)', background: accentColor ? `rgba(${accentColor}, 0.10)` : 'var(--bg-2)', transition: 'background 0.4s' }}>
        {/* Row 1: track info + controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: 'var(--bg-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {nowPlayingCover
                ? <img src={nowPlayingCover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <RecordLogo size={26} spinning={isPlaying} accentColor={accentColor} />
              }
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'var(--gray-3)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--mono)' }}>
                <Equalizer color={accentColor ? `rgb(${accentColor})` : 'var(--gold)'} active={isPlaying} width={11} height={9} />
                Now playing
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--black)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{nowPlaying || 'Pick a track to begin'}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0, marginLeft: 16 }}>
            <button onClick={() => playSong(currentIndex - 1)} title="Previous" style={{ background: 'none', border: '1px solid var(--border-strong)', borderRadius: '999px', color: 'var(--gray-2)', padding: '6px 10px', fontSize: 12 }}>⏮</button>
            <button onClick={() => playSong(currentIndex + 1)} title="Next" style={{ background: 'none', border: '1px solid var(--border-strong)', borderRadius: '999px', color: 'var(--gray-2)', padding: '6px 10px', fontSize: 12 }}>⏭</button>
            <button onClick={stopSong} style={{ background: 'var(--black)', border: 'none', borderRadius: '999px', color: '#fff', padding: '6px 16px', fontSize: 12, fontWeight: 700, letterSpacing: '0.04em' }}>■ Stop</button>
          </div>
        </div>
        {/* Row 2: progress bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, height: 2, background: 'var(--border)', borderRadius: 1, cursor: 'pointer' }}
            onClick={e => {
              const rect = e.currentTarget.getBoundingClientRect()
              const pct = (e.clientX - rect.left) / rect.width
              if (audioRef.current && audioRef.current.duration) audioRef.current.currentTime = pct * audioRef.current.duration
            }}
          >
            <div style={{ width: progress + '%', height: '100%', background: accentColor ? `rgb(${accentColor})` : 'var(--black)', borderRadius: 1, transition: 'width 0.1s, background 0.4s' }} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--gray-3)', fontVariantNumeric: 'tabular-nums', fontFamily: 'var(--mono)', flexShrink: 0 }}>{currentTime}</div>
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
              {upFile ? '✓ ' + upFile.name : `Select audio file (max ${MAX_UPLOAD_MB}MB)`}
              <input type="file" accept="audio/*" style={{ display: 'none' }} onChange={async e => {
                const f = e.target.files[0]
                if (f && f.size > MAX_UPLOAD_BYTES) {
                  setUpStatus(`File is too large (${(f.size / (1024 * 1024)).toFixed(1)}MB). Max size is ${MAX_UPLOAD_MB}MB.`)
                  setUpStatusType('error')
                  e.target.value = ''
                  setUpFile(null)
                  return
                }
                setUpStatus('')
                setUpStatusType('')
                setUpFile(f)
                if (f) {
                  const title = await readTrackTitleFromMetadata(f)
                  if (title) setUpTitle(title)
                }
              }} />
            </label>
            <label style={{ ...inputStyle, cursor: 'pointer', color: upCover ? 'var(--black)' : '#444' }}>
              {upCover ? '✓ ' + upCover.name : 'Cover art (optional)'}
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setUpCover(e.target.files[0])} />
            </label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={handleUpload} disabled={uploading} style={{ background: 'var(--gray-1)', color: '#fff', border: 'none', borderRadius: '999px', padding: '11px 24px', fontSize: 13, fontWeight: 700, transition: 'transform 0.15s', opacity: uploading ? 0.7 : 1, cursor: uploading ? 'default' : 'pointer' }}
              onMouseEnter={e => { if (!uploading) e.currentTarget.style.transform = 'scale(1.03)' }}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >Upload</button>
            {uploading && (
              <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid var(--border-strong)', borderTopColor: 'var(--gray-1)', animation: 'spinRecord 0.8s linear infinite' }} />
            )}
            {upStatus && <span style={{ fontSize: 13, color: upStatusType === 'ok' ? 'var(--black)' : upStatusType === 'error' ? '#ff5555' : '#666' }}>{upStatus}</span>}
          </div>
        </div>
      )}

      {/* Tracklist */}
      <div style={{ borderBottom: '1px solid var(--border)' }}>
        <div style={{ padding: '20px 40px 0' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: 'var(--gray-3)', textTransform: 'uppercase', paddingBottom: 12, borderBottom: '1px solid var(--border)', fontFamily: 'var(--mono)' }}>
            Tracklist
          </div>
        </div>
        {songs.length === 0 ? (
          <div style={{ padding: '48px 40px', color: 'var(--gray-1)', fontSize: 14 }}>No tracks yet. Add one above.</div>
        ) : songs.map((song, idx) => (
          <div key={song.id}
            onClick={() => editingId !== song.id && playSong(idx)}
            style={{ display: 'grid', gridTemplateColumns: '40px 1fr auto', alignItems: 'center', gap: 16, padding: '16px 40px', borderBottom: '1px solid var(--border)', borderLeft: currentIndex === idx ? `3px solid ${accentColor ? `rgb(${accentColor})` : 'var(--gold)'}` : '3px solid transparent', cursor: editingId === song.id ? 'default' : 'pointer', transition: 'background 0.15s, border-color 0.15s', background: currentIndex === idx ? `rgba(${accentColor || '216, 177, 58'}, 0.10)` : 'transparent' }}
            onMouseEnter={e => e.currentTarget.style.background = currentIndex === idx ? `rgba(${accentColor || '216, 177, 58'}, 0.16)` : 'var(--bg-2)'}
            onMouseLeave={e => { e.currentTarget.style.background = currentIndex === idx ? `rgba(${accentColor || '216, 177, 58'}, 0.10)` : 'transparent' }}
          >
            <span style={{ fontSize: 12, color: 'var(--gray-1)', fontVariantNumeric: 'tabular-nums', fontWeight: 600, fontFamily: 'var(--mono)' }}>{String(idx + 1).padStart(2, '0')}</span>
            <div>
              {editingId === song.id ? (
                <input
                  autoFocus
                  value={editValue}
                  onClick={e => e.stopPropagation()}
                  onChange={e => setEditValue(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') saveEdit(e, song.id)
                    if (e.key === 'Escape') cancelEdit(e)
                  }}
                  style={{ background: 'var(--bg-2)', border: '1px solid var(--border-strong)', color: 'var(--black)', borderRadius: 6, padding: '4px 8px', fontSize: 14, fontWeight: 600, fontFamily: 'Inter, sans-serif', outline: 'none', width: '100%' }}
                />
              ) : (
                <div style={{ fontWeight: 600, fontSize: 14, color: currentIndex === idx ? 'var(--black)' : 'var(--gray-1)' }}>{song.title}</div>
              )}
              <div style={{ fontSize: 12, color: 'var(--gray-3)', marginTop: 2 }}>{song.mixtape_name}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {editingId === song.id ? (
                <>
                  <button onClick={e => saveEdit(e, song.id)} title="Save" style={{ background: 'none', border: 'none', color: 'var(--black)', fontSize: 14, cursor: 'pointer', padding: 2 }}>✓</button>
                  <button onClick={cancelEdit} title="Cancel" style={{ background: 'none', border: 'none', color: 'var(--gray-2)', fontSize: 14, cursor: 'pointer', padding: 2 }}>✕</button>
                </>
              ) : (
                <>
                  <button onClick={e => startEdit(e, song)} title="Edit track name" style={{ background: 'none', border: 'none', color: 'var(--gray-3)', fontSize: 13, cursor: 'pointer', padding: 2 }}>✎</button>
                  {currentIndex === idx && isPlaying
                    ? <Equalizer color={accentColor ? `rgb(${accentColor})` : 'var(--gold)'} active width={13} height={12} />
                    : <span style={{ fontSize: 13, color: 'var(--gray-1)' }}>›</span>
                  }
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
