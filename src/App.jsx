import { useState } from 'react'
import './index.css'
import Intro from './pages/Intro'
import NewReleases from './pages/NewReleases'
import Radio from './pages/Radio'
import Comments from './pages/Comments'

export const SUPABASE_URL = "https://kxybghfxcfzcxfvsacaj.supabase.co"
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4eWJnaGZ4Y2Z6Y3hmdnNhY2FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1MDI1NDgsImV4cCI6MjA5ODA3ODU0OH0.I_sUe_UUpViPjE27xc01zFvILZBp8Rv18GY7bZfM7qE"
export const R2_URL = "https://pub-07b5383ddfb74164b7207ad056917cc8.r2.dev"

const TABS = [
  { id: 'intro', label: 'Intro & Player' },
  { id: 'new-releases', label: 'New Releases' },
  { id: 'radio', label: 'Radio' },
  { id: 'comments', label: 'Comments' },
]

const RecordLogo = () => (
  <svg width="48" height="48" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="rb" cx="50%" cy="45%" r="50%">
        <stop offset="0%" stopColor="#2c2c3e"/>
        <stop offset="65%" stopColor="#14141e"/>
        <stop offset="100%" stopColor="#050508"/>
      </radialGradient>
      <radialGradient id="rs" cx="38%" cy="32%" r="45%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22"/>
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
      </radialGradient>
      <radialGradient id="rl" cx="38%" cy="35%" r="55%">
        <stop offset="0%" stopColor="#f5d060"/>
        <stop offset="55%" stopColor="#d8b13a"/>
        <stop offset="100%" stopColor="#8f6f1c"/>
      </radialGradient>
      <radialGradient id="rg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00f6ff" stopOpacity="0.2"/>
        <stop offset="100%" stopColor="#00f6ff" stopOpacity="0"/>
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#rg)"/>
    <circle cx="50" cy="50" r="46" fill="url(#rb)"/>
    <circle cx="50" cy="50" r="44" fill="none" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1"/>
    <circle cx="50" cy="50" r="38" fill="none" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="0.8"/>
    <circle cx="50" cy="50" r="32" fill="none" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="0.8"/>
    <circle cx="50" cy="50" r="26" fill="none" stroke="#ffffff" strokeOpacity="0.04" strokeWidth="0.8"/>
    <circle cx="50" cy="50" r="46" fill="url(#rs)"/>
    <circle cx="50" cy="50" r="18" fill="url(#rl)"/>
    <text x="50" y="48" textAnchor="middle" fontFamily="Courier New, monospace" fontSize="5.5" fontWeight="700" fill="#3a1f00" letterSpacing="1">CULERO</text>
    <text x="50" y="55" textAnchor="middle" fontFamily="Courier New, monospace" fontSize="3.8" fill="#5a3200" letterSpacing="0.8">PODCAST</text>
    <circle cx="50" cy="50" r="3" fill="#050508"/>
  </svg>
)

export default function App() {
  const [activeTab, setActiveTab] = useState('intro')
  const [songs, setSongs] = useState([])
  const [currentIndex, setCurrentIndex] = useState(-1)

  return (
    <>
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px',
        background: 'rgba(10,12,20,0.85)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <RecordLogo />
          <h1 style={{
            margin: 0, fontSize: '1.4rem', fontWeight: 700,
            color: 'var(--accent-2)', letterSpacing: 3,
            textTransform: 'uppercase',
            textShadow: '0 0 12px var(--accent-2), 0 0 24px var(--accent)',
            borderLeft: '4px solid var(--accent-3)',
            paddingLeft: 12,
          }}>
            The Culero Podcast
          </h1>
        </div>
      </header>

      <nav style={{
        display: 'flex', gap: 4, padding: '0 24px',
        background: 'rgba(10,12,20,0.85)',
        borderBottom: '1px solid var(--border)',
      }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            background: 'transparent', border: 'none', borderRadius: 0,
            borderBottom: activeTab === tab.id ? '2px solid var(--accent-2)' : '2px solid transparent',
            padding: '12px 16px',
            color: activeTab === tab.id ? 'var(--accent-2)' : 'var(--muted)',
            fontSize: '0.8rem', letterSpacing: '1.5px',
            textShadow: activeTab === tab.id ? '0 0 8px var(--accent-2)' : 'none',
            boxShadow: 'none', transform: 'none',
          }}>
            {tab.label.toUpperCase()}
          </button>
        ))}
      </nav>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
        {activeTab === 'intro' && (
          <Intro
            songs={songs} setSongs={setSongs}
            currentIndex={currentIndex} setCurrentIndex={setCurrentIndex}
          />
        )}
        {activeTab === 'new-releases' && <NewReleases songs={songs} setCurrentIndex={setCurrentIndex} setActiveTab={setActiveTab} />}
        {activeTab === 'radio' && <Radio />}
        {activeTab === 'comments' && <Comments />}
      </main>
    </>
  )
}
