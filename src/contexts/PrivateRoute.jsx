// Importações necessárias
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

// Componente para proteger rotas que precisam de autenticação
const PrivateRoute = ({ children }) => {
  // Pega informações de autenticação do contexto
  const { isAuthenticated, loading } = useAuth()

  // Enquanto estiver carregando, não renderiza nada (ou pode mostrar um loading)
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#8e8e8e'
      }}>
        Carregando...
      </div>
    )
  }

  // Se não estiver autenticado, redireciona para login
  // Se estiver autenticado, renderiza o componente filho
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default PrivateRoute