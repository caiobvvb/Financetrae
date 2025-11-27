import { getSupabase } from '../lib/supabaseClient'
import { Budget } from '../types'

export async function listBudgets() {
  const supabase = getSupabase()
  if (!supabase) return { data: [] as Budget[], error: { message: 'Configuração do Supabase ausente' } as any }
  const { data, error } = await supabase.from('budgets').select('*').order('created_at', { ascending: false })
  return { data: data as Budget[] | null, error }
}

export async function createBudget(payload: {
  user_id: string
  category: string
  icon: string
  iconBg: string
  period: string
  spent: number
  limit: number
  color: string
}) {
  const supabase = getSupabase()
  if (!supabase) return { error: { message: 'Configuração do Supabase ausente' } as any }
  const { error } = await supabase.from('budgets').insert([payload])
  return { error }
}

