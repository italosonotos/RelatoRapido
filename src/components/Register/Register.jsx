import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './Register.module.css'
import { useAuth } from '../../contexts/AuthContext'

const Register = () => {
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { signUp } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return
    
    setError('')

    if (!email || !fullName || !username || !password) {
      setError('Por favor, preencha todos os campos!')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Por favor, insira um email válido!')
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres!')
      return
    }

    if (username.length < 3) {
      setError('O nome de usuário deve ter no mínimo 3 caracteres!')
      return
    }

    try {
      setLoading(true)
      const result = await signUp({ email, fullName, username, password })
      
      if (result.success) {
        navigate('/feed')
      } else {
        setError(result.error)
      }
    } catch {
      setError('Ocorreu um erro ao criar sua conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.signupBox}>
        <div className={styles.logoContainer}>
          <h1 className={styles.logo}>Relato Rápido</h1>
        </div>

        <p className={styles.subtitle}>
          Cadastre-se para compartilhar seus relatos com amigos.
        </p>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <div className="divider">
          <span>OU</span>
        </div>

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
            type="text"
            placeholder="Nome completo"
            className={`input ${error ? 'input-error' : ''}`}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={loading}
          />
          
          <input
            type="text"
            placeholder="Nome de usuário"
            className={`input ${error ? 'input-error' : ''}`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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

          <p className={styles.terms}>
            As pessoas que usam nosso serviço podem ter carregado suas informações de contato no Relato Rápido. <a href="#" className={styles.link}>Saiba mais</a>
          </p>

          <p className={styles.terms}>
            Ao se cadastrar, você concorda com nossos <a href="#" className={styles.link}>Termos</a>, <a href="#" className={styles.link}>Política de Privacidade</a> e <a href="#" className={styles.link}>Política de Cookies</a>.
          </p>

          <button 
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Cadastrando...' : 'Cadastre-se'}
          </button>
        </form>
      </div>

      <div className={styles.loginBox}>
        <p className={styles.loginText}>
          Tem uma conta? <Link to="/login" className={styles.loginLink}>Conecte-se</Link>
        </p>
      </div>
    </div>
  )
}

export default Register