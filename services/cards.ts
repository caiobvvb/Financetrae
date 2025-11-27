import { getSupabase } from '../lib/supabaseClient'
import { CreditCard } from '../types'

export async function listCards() {
  const supabase = getSupabase()
  if (!supabase) return { data: [] as CreditCard[], error: { message: 'Configuração do Supabase ausente' } as any }
  const { data, error } = await supabase.from('cards').select('*').order('name', { ascending: true })
  return { data: data as CreditCard[] | null, error }
}

export async function createCard(payload: { user_id: string, name: string, limit: number, currentInvoice: number, dueDate: string }) {
  const supabase = getSupabase()
  if (!supabase) return { error: { message: 'Configuração do Supabase ausente' } as any }
  const { error } = await supabase.from('cards').insert([{
    user_id: payload.user_id,
    name: payload.name,
    limit: payload.limit,
    currentInvoice: payload.currentInvoice,
    dueDate: payload.dueDate
  }])
  return { error }
}
