import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './Register.module.css'
import { useAuth } from '../../contexts/AuthContext'

const Register = () => {
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { signUp } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return
    
    setError('')

    if (!email || !fullName || !username || !password) {
      setError('Por favor, preencha todos os campos obrigatórios!')
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
      const result = await signUp({ 
        email, 
        fullName, 
        username, 
        password,
        city: city || null,
        state: state || null,
        neighborhood: neighborhood || null
      })
      
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

          {/* Campos de localização (opcionais) */}
          <div className={styles.locationSection}>
            <p className={styles.locationLabel}>
              Localização (opcional)
            </p>
            
            <div className={styles.locationRow}>
              <input
                type="text"
                placeholder="Cidade"
                className="input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={loading}
              />

              <select
                className="input"
                value={state}
                onChange={(e) => setState(e.target.value)}
                disabled={loading}
              >
                <option value="">Estado</option>
                <option value="AC">AC</option>
                <option value="AL">AL</option>
                <option value="AP">AP</option>
                <option value="AM">AM</option>
                <option value="BA">BA</option>
                <option value="CE">CE</option>
                <option value="DF">DF</option>
                <option value="ES">ES</option>
                <option value="GO">GO</option>
                <option value="MA">MA</option>
                <option value="MT">MT</option>
                <option value="MS">MS</option>
                <option value="MG">MG</option>
                <option value="PA">PA</option>
                <option value="PB">PB</option>
                <option value="PR">PR</option>
                <option value="PE">PE</option>
                <option value="PI">PI</option>
                <option value="RJ">RJ</option>
                <option value="RN">RN</option>
                <option value="RS">RS</option>
                <option value="RO">RO</option>
                <option value="RR">RR</option>
                <option value="SC">SC</option>
                <option value="SP">SP</option>
                <option value="SE">SE</option>
                <option value="TO">TO</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="Bairro"
              className="input"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              disabled={loading}
            />
          </div>

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