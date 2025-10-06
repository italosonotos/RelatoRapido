import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './contexts/PrivateRoute'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import Home from './components/Home/Home'
import Feed from './components/Feed/Feed'
import ProfileEdit from './components/ProfileEdit/ProfileEdit'

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rota inicial - Home pública */}
          <Route path="/" element={<Home />} />
          
          {/* Rota de Login */}
          <Route path="/login" element={<Login />} />
          
          {/* Rota de Cadastro */}
          <Route path="/cadastro" element={<Register />} />
          
          {/* Rota protegida - Feed (apenas usuários autenticados) */}
          <Route 
            path="/feed" 
            element={
              <PrivateRoute>
                <Feed />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
           <PrivateRoute>
          <ProfileEdit />
          </PrivateRoute>
  } 
/>
          
          {/* Rota 404 - Página não encontrada */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App