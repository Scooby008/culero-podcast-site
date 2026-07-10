import { useEffect, useRef, useState } from 'react'
import './index.css'
import RecordLogo from './components/RecordLogo'
import Equalizer from './components/Equalizer'
import Intro from './pages/Intro'
import NewReleases from './pages/NewReleases'
import Radio from './pages/Radio'
import Comments from './pages/Comments'
import { extractDominantColor } from './lib/color'

export { SUPABASE_URL, SUPABASE_ANON_KEY } from './lib/supabase'

const TABS = [
  { id: 'intro', label: 'Listen' },
  { id: 'radio', label: 'Radio' },
  { id: 'new-releases', label: 'New Releases' },
  { id: 'comments', label: 'Comments' },
]

const headerStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '0 40px', height: 64,
  background: 'rgba(20,17,15,0.92)',
  backdropFilter: 'blur(12px)',
  borderBottom: '1px solid var(--border)',
  position: 'sticky', top: 0, zIndex: 100,
}

const POS_KEY = 'culero_positions'
function loadPositions() {
  try { return JSON.parse(localStorage.getItem(POS_KEY)) || {} } catch { return {} }
}
function savePosition(id, t) {
  const p = loadPositions()
  if (t == null) delete p[id]
  else p[id] = Math.floor(t)
  localStorage.setItem(POS_KEY, JSON.stringify(p))
}

export default function App() {
  const audioRef = useRef(null)
  const pendingSeekRef = useRef(null)
  const lastPosSaveRef = useRef(0)
  const [activeTab, setActiveTab] = useState('intro')
  const [songs, setSongs] = useState([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [nowPlaying, setNowPlaying] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState('0:00')
  const [nowPlayingCover, setNowPlayingCover] = useState(null)
  const [accentColor, setAccentColor] = useState(null)
  const [listenUnlocked, setListenUnlocked] = useState(() => sessionStorage.getItem('culero_access') === 'true')

  function formatTime(s) {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  function playSong(index) {
    if (!listenUnlocked) { setActiveTab('intro'); return }
    if (index < 0 || index >= songs.length) return
    setCurrentIndex(index)
    const song = songs[index]
    const saved = loadPositions()[song.id]
    pendingSeekRef.current = saved && saved > 10 ? saved : null
    lastPosSaveRef.current = 0
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

  function togglePlay() {
    const a = audioRef.current
    if (!a) return
    if (isPlaying) a.pause()
    else if (a.src && nowPlaying) a.play()
    else if (songs.length) playSong(0)
  }

  function seekBy(delta) {
    const a = audioRef.current
    if (a && a.duration) a.currentTime = Math.min(Math.max(0, a.currentTime + delta), a.duration)
  }

  // Keyboard shortcuts: space = play/pause, arrows = seek 15s
  useEffect(() => {
    if (!listenUnlocked) return
    const onKey = e => {
      const tag = e.target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return
      if (e.code === 'Space') { e.preventDefault(); togglePlay() }
      else if (e.code === 'ArrowLeft') seekBy(-15)
      else if (e.code === 'ArrowRight') seekBy(15)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  // Media Session API: lock-screen / hardware-key controls
  useEffect(() => {
    if (!('mediaSession' in navigator)) return
    const ms = navigator.mediaSession
    const song = songs[currentIndex]
    if (song) {
      ms.metadata = new MediaMetadata({
        title: song.title,
        artist: 'Culero Podcast',
        album: song.mixtape_name || '',
        artwork: [{ src: song.cover_url || '/og-cover.png', sizes: '512x512', type: 'image/png' }],
      })
    }
    ms.playbackState = isPlaying ? 'playing' : 'paused'
    ms.setActionHandler('play', () => togglePlay())
    ms.setActionHandler('pause', () => togglePlay())
    ms.setActionHandler('previoustrack', () => playSong(currentIndex - 1))
    ms.setActionHandler('nexttrack', () => playSong(currentIndex + 1))
    ms.setActionHandler('seekbackward', () => seekBy(-15))
    ms.setActionHandler('seekforward', () => seekBy(15))
    try {
      ms.setActionHandler('seekto', d => { if (audioRef.current && d.seekTime != null) audioRef.current.currentTime = d.seekTime })
    } catch { /* not supported everywhere */ }
  })

  const playerVisible = listenUnlocked

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: playerVisible ? 96 : 0 }}>
      <header style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <RecordLogo size={32} />
          <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.5px', color: 'var(--black)' }}>
            CULERO PODCAST
          </span>
        </div>
        <nav style={{ display: 'flex', gap: 4 }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              background: activeTab === tab.id ? 'var(--gold)' : 'transparent',
              color: activeTab === tab.id ? 'var(--bg)' : 'var(--gray-2)',
              border: 'none',
              borderRadius: '999px',
              padding: '7px 16px',
              fontSize: 13,
              fontWeight: 600,
              transition: 'all 0.2s',
              letterSpacing: '0.01em',
            }}
            onMouseEnter={e => { if (activeTab !== tab.id) e.currentTarget.style.color = 'var(--black)' }}
            onMouseLeave={e => { if (activeTab !== tab.id) e.currentTarget.style.color = 'var(--gray-2)' }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      {activeTab === 'intro' && (
        <Intro
          songs={songs} setSongs={setSongs}
          currentIndex={currentIndex}
          isPlaying={isPlaying}
          accentColor={accentColor}
          playSong={playSong}
          listenUnlocked={listenUnlocked} setListenUnlocked={setListenUnlocked}
        />
      )}
      {activeTab === 'new-releases' && <NewReleases songs={songs} playSong={playSong} setActiveTab={setActiveTab} />}
      {activeTab === 'radio' && <Radio />}
      {activeTab === 'comments' && <Comments />}

      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: 'var(--gray-2)', fontFamily: 'var(--mono)' }}>© 2026 Culero Podcast <span style={{ color: 'var(--gold)' }}>·</span> Chicago</span>
        <span style={{ fontSize: 12, color: 'var(--gray-2)', fontFamily: 'var(--mono)', transition: 'color 0.2s', cursor: 'default' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--gray-2)'}
        >bajingo.xyz</span>
      </footer>

      {/* Persistent bottom player */}
      {playerVisible && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200, padding: '12px 40px 14px', background: accentColor ? `linear-gradient(rgba(${accentColor}, 0.08), rgba(${accentColor}, 0.08)), rgba(20,17,15,0.96)` : 'rgba(20,17,15,0.96)', backdropFilter: 'blur(14px)', borderTop: '1px solid var(--border)', transition: 'background 0.4s' }}>
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
            <div style={{ display: 'flex', gap: 6, flexShrink: 0, marginLeft: 16, alignItems: 'center' }}>
              <button onClick={() => playSong(currentIndex - 1)} title="Previous track" style={{ background: 'none', border: '1px solid var(--border-strong)', borderRadius: '999px', color: 'var(--gray-2)', padding: '6px 10px', fontSize: 12 }}>⏮</button>
              <button onClick={() => seekBy(-15)} title="Back 15 seconds (←)" style={{ background: 'none', border: '1px solid var(--border-strong)', borderRadius: '999px', color: 'var(--gray-2)', padding: '6px 10px', fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700 }}>−15</button>
              <button onClick={togglePlay} title={isPlaying ? 'Pause (space)' : 'Play (space)'} style={{ background: accentColor ? `rgb(${accentColor})` : 'var(--gold)', border: 'none', borderRadius: '50%', color: 'var(--bg)', width: 38, height: 38, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.4s, transform 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >{isPlaying ? '❚❚' : '▶'}</button>
              <button onClick={() => seekBy(15)} title="Forward 15 seconds (→)" style={{ background: 'none', border: '1px solid var(--border-strong)', borderRadius: '999px', color: 'var(--gray-2)', padding: '6px 10px', fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700 }}>+15</button>
              <button onClick={() => playSong(currentIndex + 1)} title="Next track" style={{ background: 'none', border: '1px solid var(--border-strong)', borderRadius: '999px', color: 'var(--gray-2)', padding: '6px 10px', fontSize: 12 }}>⏭</button>
              <button onClick={stopSong} title="Stop" style={{ background: 'var(--black)', border: 'none', borderRadius: '999px', color: 'var(--bg)', padding: '6px 16px', fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', marginLeft: 4 }}>■ Stop</button>
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
              <div style={{ width: progress + '%', height: '100%', background: accentColor ? `rgb(${accentColor})` : 'var(--gold)', borderRadius: 1, transition: 'width 0.1s, background 0.4s' }} />
            </div>
            <div style={{ fontSize: 12, color: 'var(--gray-3)', fontVariantNumeric: 'tabular-nums', fontFamily: 'var(--mono)', flexShrink: 0 }}>{currentTime}</div>
          </div>
        </div>
      )}

      <audio ref={audioRef} style={{ display: 'none' }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onLoadedMetadata={() => {
          const a = audioRef.current
          if (a && pendingSeekRef.current != null) {
            if (pendingSeekRef.current < a.duration - 10) a.currentTime = pendingSeekRef.current
            pendingSeekRef.current = null
          }
        }}
        onEnded={() => {
          setIsPlaying(false)
          const song = songs[currentIndex]
          if (song) savePosition(song.id, null) // finished — start fresh next time
          playSong(currentIndex + 1)
        }}
        onTimeUpdate={() => {
          if (!audioRef.current) return
          const { currentTime: ct, duration } = audioRef.current
          if (duration) setProgress((ct / duration) * 100)
          setCurrentTime(formatTime(ct))
          const song = songs[currentIndex]
          if (song && Math.abs(ct - lastPosSaveRef.current) > 3) {
            lastPosSaveRef.current = ct
            savePosition(song.id, ct)
          }
        }}
      />
    </div>
  )
}
