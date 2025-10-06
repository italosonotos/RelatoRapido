// Importações necessárias
import React, { useState } from 'react' // React e hook useState para gerenciar estado
import styles from './Login.module.css' // Estilos CSS Module específicos deste componente
import { Link, useNavigate } from 'react-router-dom' // Link para navegação e useNavigate para redirecionamento
import { useAuth } from '../../contexts/AuthContext' // Hook de autenticação

const Login = () => {
  // Estados para armazenar os valores dos campos de input
  const [email, setEmail] = useState('') // Armazena o email
  const [password, setPassword] = useState('') // Armazena a senha
  const [error, setError] = useState('') // Armazena mensagens de erro
  const [loading, setLoading] = useState(false) // Controla estado de carregamento

  // Hook de navegação para redirecionar após login
  const navigate = useNavigate()
  
  // Hook de autenticação
  const { signIn } = useAuth()

  // Função executada ao submeter o formulário
  const handleSubmit = async (e) => {
    e.preventDefault() // IMPORTANTE: Previne o comportamento padrão do form
    
    // Evita múltiplas submissões simultâneas
    if (loading) return

    // Limpa erros anteriores
    setError('')

    // Validação básica
    if (!email || !password) {
      setError('Por favor, preencha todos os campos!')
      return
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Por favor, insira um email válido!')
      return
    }

    try {
      setLoading(true)
      
      // Tenta fazer login
      const result = await signIn(email, password)
      
      if (result.success) {
        // Redireciona para o feed após login bem-sucedido
        navigate('/feed')
      } else {
        // Mostra mensagem de erro
        setError(result.error)
      }
    } catch  {
      setError('Ocorreu um erro ao fazer login. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    // Container principal que centraliza todo o conteúdo
    <div className={styles.container}>
      
      {/* Caixa principal do formulário de login */}
      <div className={styles.loginBox}>
        
        {/* Container da logo/título do projeto */}
        <div className={styles.logoContainer}>
          <h1 className={styles.logo}>Relato Rapido</h1>
        </div>

        {/* Mensagem de erro (se houver) */}
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {/* FORMULÁRIO - Agora usando <form> com onSubmit */}
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          
          {/* Input para email */}
          <input
            type="email"
            placeholder="Email"
            className={styles.input}
            value={email} // Valor controlado pelo estado
            onChange={(e) => setEmail(e.target.value)} // Atualiza o estado ao digitar
            disabled={loading}
          />
          
          {/* Input para senha */}
          <input
            type="password"
            placeholder="Senha"
            className={styles.input}
            value={password} // Valor controlado pelo estado
            onChange={(e) => setPassword(e.target.value)} // Atualiza o estado ao digitar
            disabled={loading}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSubmit(e)
              }
            }}
          />

          {/* Botão de submit do login */}
          <button 
            type="submit"
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* Divisor visual com texto "OU" */}
        <div className={styles.divider}>
          <div className={styles.line}></div> {/* Linha esquerda */}
          <span className={styles.dividerText}>OU</span> {/* Texto central */}
          <div className={styles.line}></div> {/* Linha direita */}
        </div>

        {/* Link para recuperação de senha */}
        <a href="#" className={styles.forgotPassword}>
          Esqueceu a senha?
        </a>
      </div>

      {/* Caixa inferior com link para cadastro */}
      <div className={styles.signupBox}>
        <p className={styles.signupText}>
          {/* Link que navega para a página de cadastro usando React Router */}
          Não tem uma conta? <Link to="/cadastro" className={styles.signupLink}>Cadastre-se</Link>
        </p>
      </div>
    </div>
  )
}

// Exporta o componente para ser usado em outros arquivos
export default Login