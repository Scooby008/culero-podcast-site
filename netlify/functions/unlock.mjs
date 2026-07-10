// Server-side password check — the password lives in the SITE_PASSWORD
// environment variable (Netlify → Site settings → Environment variables),
// not in the client bundle.
const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

export default async (req) => {
  if (req.method !== 'POST') return json(405, { error: 'Method not allowed' })
  if (!process.env.SITE_PASSWORD) return json(500, { error: 'SITE_PASSWORD is not configured' })
  const { password } = await req.json().catch(() => ({}))
  const ok = typeof password === 'string' && password === process.env.SITE_PASSWORD
  return json(ok ? 200 : 401, { ok })
}

export const config = { path: '/api/unlock' }
