import { useState } from 'react'
import './index.css'
import Episodes from './pages/Episodes'
import Radio from './pages/Radio'
import About from './pages/About'

const TABS = [
  { id: 'episodes', label: 'EPISODES' },
  { id: 'radio', label: 'RADIO' },
  { id: 'about', label: 'ABOUT' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('episodes')

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 1.25rem' }}>
      <header style={{ padding: '2rem 0 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>
            CULERO
          </h1>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: 'var(--red)', letterSpacing: '0.12em' }}>
            PODCAST
          </span>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: '1.5rem' }}>
          Real talk. No filter.
        </p>

        <nav style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)' }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--red)' : '2px solid transparent',
                color: activeTab === tab.id ? 'var(--white)' : 'var(--muted)',
                fontFamily: 'var(--font-display)',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.08em',
                padding: '0.75rem 1.25rem 0.65rem',
                marginBottom: -1,
                transition: 'color 0.15s',
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <main style={{ padding: '2rem 0 4rem' }}>
        {activeTab === 'episodes' && <Episodes />}
        {activeTab === 'radio' && <Radio />}
        {activeTab === 'about' && <About />}
      </main>
    </div>
  )
}
