import { getSupabase } from '../lib/supabaseClient'
import { Account } from '../types'

export async function listAccounts() {
  const supabase = getSupabase()
  if (!supabase) return { data: [] as Account[], error: { message: 'Configuração do Supabase ausente' } as any }
  const { data, error } = await supabase.from('accounts').select('*').order('name', { ascending: true })
  return { data: data as Account[] | null, error }
}

export async function createAccount(payload: { user_id: string, name: string, balance: number, type: 'wallet' | 'bank' | 'investment' }) {
  const supabase = getSupabase()
  if (!supabase) return { error: { message: 'Configuração do Supabase ausente' } as any }
  const { error } = await supabase.from('accounts').insert([payload])
  return { error }
}

