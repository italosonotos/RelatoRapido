import React, { useState } from 'react'
import styles from './Login.module.css'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { signIn } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    setError('')

    if (!email || !password) {
      setError('Por favor, preencha todos os campos!')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Por favor, insira um email válido!')
      return
    }

    try {
      setLoading(true)
      const result = await signIn(email, password)
      
      if (result.success) {
        navigate('/feed')
      } else {
        setError(result.error)
      }
    } catch {
      setError('Ocorreu um erro ao fazer login. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.logoContainer}>
          <h1 className={styles.logo}>Relato Rápido</h1>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <input
            type="email"
            placeholder="Email"
            className={`input ${error ? 'input-error' : ''}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          
          <input
            type="password"
            placeholder="Senha"
            className={`input ${error ? 'input-error' : ''}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <button 
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="divider">
          <span>OU</span>
        </div>

        <a href="#" className={styles.forgotPassword}>
          Esqueceu a senha?
        </a>
      </div>

      <div className={styles.signupBox}>
        <p className={styles.signupText}>
          Não tem uma conta? <Link to="/cadastro" className={styles.signupLink}>Cadastre-se</Link>
        </p>
      </div>
    </div>
  )
}

export default Login