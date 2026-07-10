// Deletes a song row. Requires the site password; uses the Supabase
// service-role key (SUPABASE_SERVICE_ROLE_KEY env var) since RLS
// restricts deletes to authenticated roles.
const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

export default async (req) => {
  if (req.method !== 'POST') return json(405, { error: 'Method not allowed' })
  const { SITE_PASSWORD, SUPABASE_SERVICE_ROLE_KEY } = process.env
  const SUPABASE_URL = 'https://kxybghfxcfzcxfvsacaj.supabase.co'
  if (!SITE_PASSWORD || !SUPABASE_SERVICE_ROLE_KEY) return json(500, { error: 'Delete service is not configured' })
  if (req.headers.get('x-site-password') !== SITE_PASSWORD) return json(401, { error: 'Unauthorized' })

  const { id } = await req.json().catch(() => ({}))
  if (!id || !/^[0-9a-f-]{36}$/i.test(String(id))) return json(400, { error: 'Bad request' })

  const res = await fetch(`${SUPABASE_URL}/rest/v1/songs?id=eq.${id}`, {
    method: 'DELETE',
    headers: { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` },
  })
  if (!res.ok) return json(502, { error: 'Delete failed (' + res.status + ')' })
  return json(200, { ok: true })
}

export const config = { path: '/api/delete-song' }
