// Issues short-lived presigned PUT URLs for direct browser → R2 uploads.
// R2 credentials live only in environment variables:
//   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL
import { AwsClient } from 'aws4fetch'

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

export default async (req) => {
  if (req.method !== 'POST') return json(405, { error: 'Method not allowed' })

  const { SITE_PASSWORD, R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL } = process.env
  if (!SITE_PASSWORD || !R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET || !R2_PUBLIC_URL) {
    return json(500, { error: 'Upload service is not configured' })
  }
  if (req.headers.get('x-site-password') !== SITE_PASSWORD) return json(401, { error: 'Unauthorized' })

  const { filename, folder = 'audio' } = await req.json().catch(() => ({}))
  if (!filename || !/^(audio|covers)$/.test(folder)) return json(400, { error: 'Bad request' })

  const safeName = String(filename).replace(/[^\w.\-]+/g, '_').slice(-100)
  const key = `${folder}/${Date.now()}_${safeName}`

  const aws = new AwsClient({ accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY, service: 's3' })
  const url = new URL(`https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET}/${key}`)
  url.searchParams.set('X-Amz-Expires', '600') // valid for 10 minutes
  const signed = await aws.sign(new Request(url, { method: 'PUT' }), { aws: { signQuery: true } })

  return json(200, { uploadUrl: signed.url, publicUrl: `${R2_PUBLIC_URL}/${key}` })
}

export const config = { path: '/api/presign' }
