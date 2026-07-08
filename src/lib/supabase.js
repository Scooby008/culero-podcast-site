// Single shared Supabase client — avoids the "Multiple GoTrueClient instances"
// warning caused by creating a new client on every call.
export const SUPABASE_URL = 'https://kxybghfxcfzcxfvsacaj.supabase.co'
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4eWJnaGZ4Y2Z6Y3hmdnNhY2FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1MDI1NDgsImV4cCI6MjA5ODA3ODU0OH0.I_sUe_UUpViPjE27xc01zFvILZBp8Rv18GY7bZfM7qE'

let clientPromise = null

export function getSupabase() {
  if (!clientPromise) {
    clientPromise = import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm')
      .then(({ createClient }) => createClient(SUPABASE_URL, SUPABASE_ANON_KEY))
  }
  return clientPromise
}
