import { useEffect, useState } from 'react'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../App'

export default function Comments() {
  const [comments, setComments] = useState([])
  const [name, setName] = useState('')
  const [body, setBody] = useState('')
  const [status, setStatus] = useState('')
  const [statusType, setStatusType] = useState('')

  async function getSupabase() {
    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm')
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  }

  useEffect(() => { loadComments() }, [])

  async function loadComments() {
    const sb = await getSupabase()
    const { data } = await sb.from('comments').select('*').order('created_at', { ascending: false })
    if (data) setComments(data)
  }

  async function handleSubmit() {
    if (!name || !body) { setStatus('Name and comment are required.'); setStatusType('error'); return }
    const sb = await getSupabase()
    const { error } = await sb.from('comments').insert({ name, body })
    if (error) { setStatus('Could not post comment.'); setStatusType('error'); return }
    setName(''); setBody('')
    setStatus('Posted!'); setStatusType('ok')
    loadComments()
  }

  const inputStyle = {
    background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--black)',
    borderRadius: 8, padding: '12px 16px', fontSize: 14,
    fontFamily: 'Inter, sans-serif', width: '100%', outline: 'none',
    transition: 'border-color 0.2s',
  }

  return (
    <div>
      <div style={{ padding: '80px 40px 64px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', color: 'var(--gray-3)', textTransform: 'uppercase', marginBottom: 20, opacity: 0, animation: 'fadeUp 0.6s 0.1s forwards' }}>Community</div>
        <h1 style={{ fontSize: 64, fontWeight: 900, letterSpacing: '-3px', lineHeight: 0.92, color: 'var(--black)', opacity: 0, animation: 'fadeUp 0.6s 0.25s forwards' }}>Say something.</h1>
      </div>

      <div style={{ maxWidth: 600, padding: '40px 40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          <input style={inputStyle} placeholder="Your name" value={name} onChange={e => setName(e.target.value)}
            onFocus={e => e.target.style.borderColor = '#333'} onBlur={e => e.target.style.borderColor = '#1a1a1a'} />
          <textarea style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }} placeholder="What's on your mind..." value={body} onChange={e => setBody(e.target.value)}
            onFocus={e => e.target.style.borderColor = '#333'} onBlur={e => e.target.style.borderColor = '#1a1a1a'} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={handleSubmit}
            style={{ background: 'var(--black)', color: 'var(--black)', border: 'none', borderRadius: '999px', padding: '12px 24px', fontSize: 14, fontWeight: 700, transition: 'transform 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >Post comment</button>
          {status && <span style={{ fontSize: 13, color: statusType === 'ok' ? '#5aea8a' : '#ff5555' }}>{status}</span>}
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)' }}>
        {comments.length === 0
          ? <div style={{ padding: '40px', color: 'var(--gray-1)', fontSize: 14 }}>No comments yet — be the first.</div>
          : comments.map((c, i) => (
            <div key={c.id} style={{ padding: '24px 40px', borderBottom: '1px solid var(--border)', animation: `slideIn 0.4s ${i * 0.05}s both` }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--black)' }}>{c.name}</span>
                <span style={{ fontSize: 11, color: 'var(--gray-1)' }}>{new Date(c.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--gray-2)', lineHeight: 1.6 }}>{c.body}</p>
            </div>
          ))
        }
      </div>
    </div>
  )
}
