import { useState } from 'react'
import './index.css'
import RecordLogo from './components/RecordLogo'
import Intro from './pages/Intro'
import NewReleases from './pages/NewReleases'
import Radio from './pages/Radio'
import Comments from './pages/Comments'

export const SUPABASE_URL = "https://kxybghfxcfzcxfvsacaj.supabase.co"
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4eWJnaGZ4Y2Z6Y3hmdnNhY2FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1MDI1NDgsImV4cCI6MjA5ODA3ODU0OH0.I_sUe_UUpViPjE27xc01zFvILZBp8Rv18GY7bZfM7qE"
export const R2_URL = "https://pub-07b5383ddfb74164b7207ad056917cc8.r2.dev"

const TABS = [
  { id: 'intro', label: 'Listen' },
  { id: 'radio', label: 'Radio' },
  { id: 'new-releases', label: 'New Releases' },
  { id: 'comments', label: 'Comments' },
]

const headerStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '0 40px', height: 64,
  background: 'rgba(240,240,240,0.92)',
  backdropFilter: 'blur(12px)',
  borderBottom: '1px solid var(--border)',
  position: 'sticky', top: 0, zIndex: 100,
}

export default function App() {
  const [activeTab, setActiveTab] = useState('intro')
  const [songs, setSongs] = useState([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [nowPlaying, setNowPlaying] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [listenUnlocked, setListenUnlocked] = useState(() => sessionStorage.getItem('culero_access') === 'true')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
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
              background: activeTab === tab.id ? 'var(--black)' : 'transparent',
              color: activeTab === tab.id ? '#fff' : 'var(--gray-2)',
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
          currentIndex={currentIndex} setCurrentIndex={setCurrentIndex}
          nowPlaying={nowPlaying} setNowPlaying={setNowPlaying}
          isPlaying={isPlaying} setIsPlaying={setIsPlaying}
          listenUnlocked={listenUnlocked} setListenUnlocked={setListenUnlocked}
        />
      )}
      {activeTab === 'new-releases' && <NewReleases songs={songs} setCurrentIndex={setCurrentIndex} setActiveTab={setActiveTab} />}
      {activeTab === 'radio' && <Radio />}
      {activeTab === 'comments' && <Comments />}

      <footer style={{ borderTop: '1px solid #1a1a1a', padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: 'var(--gray-2)' }}>© 2026 Culero Podcast · Chicago</span>
        <span style={{ fontSize: 12, color: 'var(--gray-2)' }}>bajingo.xyz</span>
      </footer>
    </div>
  )
}
