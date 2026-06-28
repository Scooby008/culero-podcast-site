import { useEffect, useState } from 'react'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../App'

export default function Comments({ session }) {
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
    const { data, error } = await sb.from('comments').select('*').order('created_at', { ascending: false })
    if (!error) setComments(data || [])
  }

  async function handleSubmit() {
    if (!name || !body) { setStatus('Name and comment are both required.'); setStatusType('error'); return }
    const sb = await getSupabase()
    const { error } = await sb.from('comments').insert({ name, body })
    if (error) { setStatus('Could not post comment: ' + error.message); setStatusType('error'); return }
    setName(''); setBody('')
    setStatus('Posted!'); setStatusType('ok')
    loadComments()
  }

  return (
    <div className="card">
      <h3>Comments</h3>
      {comments.length === 0
        ? <p className="muted">No comments yet — be the first.</p>
        : comments.map(c => (
          <div key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '12px 0' }}>
            <span style={{ color: 'var(--accent-3)', fontWeight: 600 }}>{c.name}</span>
            <span className="muted" style={{ fontSize: '0.8rem', marginLeft: 8 }}>{new Date(c.created_at).toLocaleString()}</span>
            <p style={{ marginTop: 4 }}>{c.body}</p>
          </div>
        ))
      }
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
        <input placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
        <textarea placeholder="Say something about the mixtapes…" value={body} onChange={e => setBody(e.target.value)} />
        <button className="primary" onClick={handleSubmit}>Post comment</button>
        {status && <div className={`status-msg${statusType ? ' ' + statusType : ''}`}>{status}</div>}
      </div>
    </div>
  )
}
