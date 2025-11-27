import React, { useState } from 'react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { useAuth } from '../contexts/AuthProvider'
import { useNavigate } from 'react-router-dom'

const SignUp: React.FC = () => {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await signUp(email, password, { full_name: fullName })
    if (error) {
      setError(error.message)
    } else {
      setInfo('Conta criada. Verifique seu email para confirmar e depois faça login.')
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center h-full">
      <Card className="p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Criar conta</h1>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        {info && <div className="mb-4 text-green-600">{info}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Nome completo</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark"
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Criando...' : 'Criar conta'}
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default SignUp
