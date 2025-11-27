import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthProvider'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) {
    return <div className="flex items-center justify-center h-full">Carregando...</div>
  }
  if (!user) {
    return <Navigate to="/signin" replace />
  }
  return <>{children}</>
}

export default ProtectedRoute

