import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './Register.module.css'
import { useAuth } from '../../contexts/AuthContext'
import { validateUser } from '../../Utils/validation.js'

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    username: '',
    password: '',
    city: '',
    state: '',
    neighborhood: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { signUp } = useAuth()

  // Handler unificado para mudanças nos inputs
  const handleChange = (e) => {
    const { name, value } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpa erro específico do campo quando usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return
    
    // Limpa erros anteriores
    setErrors({})

    // Validação usando a função centralizada
    const validation = validateUser(formData)

    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    // Prossegue com o cadastro
    try {
      setLoading(true)
      const result = await signUp({ 
        email: formData.email, 
        fullName: formData.fullName, 
        username: formData.username, 
        password: formData.password,
        city: formData.city || null,
        state: formData.state || null,
        neighborhood: formData.neighborhood || null
      })
      
      if (result.success) {
        navigate('/feed')
      } else {
        setErrors({ general: result.error })
      }
    } catch {
      setErrors({ general: 'Ocorreu um erro ao criar sua conta. Tente novamente.' })
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

        {/* Erro geral (do backend) */}
        {errors.general && (
          <div className="alert alert-error">
            {errors.general}
          </div>
        )}

        <div className="divider">
          <span>OU</span>
        </div>

        <form onSubmit={handleSubmit} className={styles.formContainer}>
          {/* Email */}
          <div className={styles.inputGroup}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={`input ${errors.email ? 'input-error' : ''}`}
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.email && (
              <span className={styles.errorText}>{errors.email}</span>
            )}
          </div>

          {/* Nome completo */}
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="fullName"
              placeholder="Nome completo"
              className={`input ${errors.fullName ? 'input-error' : ''}`}
              value={formData.fullName}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.fullName && (
              <span className={styles.errorText}>{errors.fullName}</span>
            )}
          </div>
          
          {/* Username */}
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="username"
              placeholder="Nome de usuário"
              className={`input ${errors.username ? 'input-error' : ''}`}
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.username && (
              <span className={styles.errorText}>{errors.username}</span>
            )}
          </div>
          
          {/* Senha */}
          <div className={styles.inputGroup}>
            <input
              type="password"
              name="password"
              placeholder="Senha"
              className={`input ${errors.password ? 'input-error' : ''}`}
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.password && (
              <span className={styles.errorText}>{errors.password}</span>
            )}
          </div>

          {/* Campos de localização (opcionais) */}
          <div className={styles.locationSection}>
            <p className={styles.locationLabel}>
              Localização (opcional)
            </p>
            
            <div className={styles.locationRow}>
              <input
                type="text"
                name="city"
                placeholder="Cidade"
                className="input"
                value={formData.city}
                onChange={handleChange}
                disabled={loading}
              />

              <select
                name="state"
                className="input"
                value={formData.state}
                onChange={handleChange}
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
              name="neighborhood"
              placeholder="Bairro"
              className="input"
              value={formData.neighborhood}
              onChange={handleChange}
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
      
      <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem' }}>
        <button 
          onClick={() => navigate('/terms')}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--color-primary)', 
            textDecoration: 'underline',
            cursor: 'pointer'
          }}
        >
          Termos de Uso
        </button>
      </div>
    </div>
  )
}

export default Register