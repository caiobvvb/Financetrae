import { createClient, SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL || ''
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const hasSupabaseConfig = Boolean(url && anonKey)

let client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient | null {
  if (!hasSupabaseConfig) return null
  if (!client) {
    client = createClient(url, anonKey)
  }
  return client
}

