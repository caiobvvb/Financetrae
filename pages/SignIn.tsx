import React, { useState } from 'react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { useAuth } from '../contexts/AuthProvider'
import { Link } from 'react-router-dom'

const SignIn: React.FC = () => {
  const { signInWithPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await signInWithPassword(email, password)
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center h-full">
      <Card className="p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Entrar</h1>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
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
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
        <div className="mt-4 text-sm text-text-light-secondary dark:text-text-dark-secondary">
          Não tem conta? <Link to="/signup" className="text-primary font-medium">Criar conta</Link>
        </div>
      </Card>
    </div>
  )
}

export default SignIn
