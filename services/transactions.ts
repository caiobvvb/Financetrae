import { getSupabase } from '../lib/supabaseClient'
import { Transaction } from '../types'

export async function listTransactions() {
  const supabase = getSupabase()
  if (!supabase) {
    return { data: [] as Transaction[], error: { message: 'Configuração do Supabase ausente' } as any }
  }
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: true })
  return { data: data as Transaction[] | null, error }
}
