import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import PrivateRoute from './contexts/PrivateRoute'

import Login from './components/Login/Login'
import Register from './components/Register/Register'
import Home from './components/Home/Home'
import Feed from './components/Feed/Feed'
import Profile from './components/Profile/Profile'
import ProfileEdit from './components/ProfileEdit/ProfileEdit'
import Terms from './Pages/Terms/Terms'
import UserProfile from './Pages/UserProfile/UserProfile'

const AppContent = () => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!loading && user && (location.pathname === '/login' || location.pathname === '/cadastro')) {
      navigate('/feed')
    }
  }, [user, loading, navigate, location])

  return (
    <Routes>
      {/* Rota inicial - Home pública */}
      <Route path="/" element={<Home />} />

      {/* Rota de Login */}
      <Route path="/login" element={<Login />} />

      {/* Rota de Cadastro */}
      <Route path="/cadastro" element={<Register />} />

      {/* Rota protegida - Feed */}
      <Route
        path="/feed"
        element={
          <PrivateRoute>
            <Feed />
          </PrivateRoute>
        }
      />

      {/* Rota protegida - Profile */}
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      {/* Rota protegida - ProfileEdit */}
      <Route
        path="/profile/edit"
        element={
          <PrivateRoute>
            <ProfileEdit />
          </PrivateRoute>
        }
      />

      {/* Rota pública - Perfil de outro usuário */}
      <Route path="/user/:userId" element={<UserProfile />} />

      {/* Rota de Termos de Uso */}
      <Route path="/terms" element={<Terms />} />

      {/* Rota 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

const App = () => (
  <Router>
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  </Router>
)

export default App
