import { useState } from 'react'
import './index.css'
import Intro from './pages/Intro'
import NewReleases from './pages/NewReleases'
import Radio from './pages/Radio'
import Comments from './pages/Comments'

const SUPABASE_URL = "https://kxybghfxcfzcxfvsacaj.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4eWJnaGZ4Y2Z6Y3hmdnNhY2FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1MDI1NDgsImV4cCI6MjA5ODA3ODU0OH0.I_sUe_UUpViPjE27xc01zFvILZBp8Rv18GY7bZfM7qE"
const ADMIN_EMAIL = "chrissalinas2005@gmail.com"
const USER_EMAIL = "user@theculeropodcast.com"

export { SUPABASE_URL, SUPABASE_ANON_KEY, ADMIN_EMAIL, USER_EMAIL }

const TABS = [
  { id: 'intro', label: 'Intro & Player' },
  { id: 'new-releases', label: 'New Releases' },
  { id: 'radio', label: 'Radio' },
  { id: 'comments', label: 'Comments' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('intro')
  const [session, setSession] = useState(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginEmail, setLoginEmail] = useState(ADMIN_EMAIL)
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [songs, setSongs] = useState([])
  const [currentIndex, setCurrentIndex] = useState(-1)

  function roleForEmail(email) {
    if (email === ADMIN_EMAIL) return 'admin'
    if (email === USER_EMAIL) return 'user'
    return null
  }

  const role = session ? roleForEmail(session.user.email) : null

  async function handleLogin() {
    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm')
    const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    const { data, error } = await sb.auth.signInWithPassword({ email: loginEmail, password: loginPassword })
    if (error) { setLoginError('Incorrect password.'); return }
    setSession(data.session)
    setShowLoginModal(false)
    setLoginError('')
    setLoginPassword('')
  }

  async function handleLogout() {
    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm')
    const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    await sb.auth.signOut()
    setSession(null)
  }

  return (
    <>
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px',
        background: 'rgba(10,12,20,0.85)',
        borderBottom: '1px solid var(--border)',
      }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
            {role === 'admin' ? 'Logged in as admin' : role === 'user' ? 'Logged in as user' : 'Not logged in'}
          </span>
          {!session && <>
            <button onClick={() => { setLoginEmail(ADMIN_EMAIL); setShowLoginModal(true) }}>Admin Login</button>
            <button onClick={() => { setLoginEmail(USER_EMAIL); setShowLoginModal(true) }}>User Login</button>
          </>}
          {session && <button onClick={handleLogout}>Log out</button>}
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
            session={session} role={role}
            songs={songs} setSongs={setSongs}
            currentIndex={currentIndex} setCurrentIndex={setCurrentIndex}
          />
        )}
        {activeTab === 'new-releases' && <NewReleases songs={songs} setCurrentIndex={setCurrentIndex} setActiveTab={setActiveTab} />}
        {activeTab === 'radio' && <Radio />}
        {activeTab === 'comments' && <Comments session={session} />}
      </main>

      {showLoginModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(5,5,15,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
        }}>
          <div style={{
            background: 'var(--panel)', border: '1px solid var(--border)',
            borderRadius: 12, padding: 24, width: 320,
            boxShadow: '0 0 40px rgba(0,246,255,0.25)',
          }}>
            <h3 style={{ marginTop: 0, color: 'var(--accent-2)', marginBottom: 16 }}>Admin Login</h3>
            <div style={{ marginBottom: 14 }}>
              <input
                type="password" placeholder="Password" value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                style={{ width: '100%' }}
              />
            </div>
            {loginError && <div className="status-msg error" style={{ marginBottom: 10 }}>{loginError}</div>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => { setShowLoginModal(false); setLoginError('') }}>Cancel</button>
              <button className="primary" onClick={handleLogin}>Log in</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
