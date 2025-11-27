import { getSupabase } from '../lib/supabaseClient'

export type CategoryKind = 'expense' | 'income'

export interface CategoryRecord {
  id: string
  user_id: string
  name: string
  icon: string
  color: string
  kind: CategoryKind
}

export async function listCategories(kind: CategoryKind) {
  const supabase = getSupabase()
  if (!supabase) return { data: [] as CategoryRecord[], error: { message: 'Configuração do Supabase ausente' } as any }
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('kind', kind)
    .order('name', { ascending: true })
  return { data: data as CategoryRecord[] | null, error }
}

export async function createCategory(payload: { user_id: string, name: string, icon: string, color: string, kind: CategoryKind }) {
  const supabase = getSupabase()
  if (!supabase) return { error: { message: 'Configuração do Supabase ausente' } as any }
  const { error } = await supabase.from('categories').insert([payload])
  return { error }
}

