import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getSupabase, hasSupabaseConfig } from '../lib/supabaseClient'

interface AuthContextValue {
  user: any
  loading: boolean
  signInWithPassword: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
  signUp: (email: string, password: string, data?: Record<string, any>) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const supabase = getSupabase()
    if (!supabase || !hasSupabaseConfig) {
      setLoading(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setUser(data.session?.user ?? null)
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    signInWithPassword: async (email, password) => {
      const s = getSupabase()
      if (!s) return { error: { message: 'Configuração do Supabase ausente' } }
      const { error } = await s.auth.signInWithPassword({ email, password })
      return { error }
    },
    signOut: async () => {
      const s = getSupabase()
      if (!s) return { error: { message: 'Configuração do Supabase ausente' } }
      const { error } = await s.auth.signOut()
      return { error }
    },
    signUp: async (email, password, data) => {
      const s = getSupabase()
      if (!s) return { error: { message: 'Configuração do Supabase ausente' } }
      const { error } = await s.auth.signUp({
        email,
        password,
        options: {
          data,
          emailRedirectTo: `${window.location.origin}/#/signin`
        }
      })
      return { error }
    }
  }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
