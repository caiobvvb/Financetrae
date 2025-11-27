import React, { useEffect, useState } from 'react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { getSupabase, hasSupabaseConfig } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthProvider'

const Health: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const { user } = useAuth()

  const run = async () => {
    if (!hasSupabaseConfig) {
      setStatus('error')
      setMessage('Env de Supabase ausente')
      return
    }
    const supabase = getSupabase()
    if (!supabase) {
      setStatus('error')
      setMessage('Cliente Supabase não inicializado')
      return
    }
    const { data, error } = await supabase.from('transactions').select('*').limit(1)
    if (error) {
      setStatus('error')
      setMessage(error.message)
    } else {
      setStatus('ok')
      setMessage(`Leitura OK (${data?.length ?? 0} registro(s))`)
    }
  }

  useEffect(() => { run() }, [])

  return (
    <div className="flex items-center justify-center h-full">
      <Card className="p-8 w-full max-w-lg space-y-4">
        <h1 className="text-2xl font-bold">Health Check Supabase</h1>
        <div className={status === 'ok' ? 'text-green-600' : status === 'error' ? 'text-red-600' : ''}>{message || 'Verificando...'}</div>
        <div className="flex gap-3">
          <Button onClick={run}>Testar novamente</Button>
          <Button
            onClick={async () => {
              const supabase = getSupabase()
              if (!supabase || !user) {
                setStatus('error')
                setMessage('Faça login para inserir dados de exemplo')
                return
              }
              const { error } = await supabase.from('transactions').insert([
                {
                  user_id: user.id,
                  description: 'Exemplo',
                  amount: 123.45,
                  date: new Date().toISOString().slice(0, 10),
                  category: 'Teste',
                  type: 'income',
                  status: 'paid'
                }
              ])
              if (error) {
                setStatus('error')
                setMessage(error.message)
              } else {
                setStatus('ok')
                setMessage('Inserção OK, recarregando leitura...')
                run()
              }
            }}
            variant="secondary"
          >Inserir exemplo</Button>
        </div>
      </Card>
    </div>
  )
}

export default Health
