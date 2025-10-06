// Importações necessárias
import React, { useState } from 'react' // React e hook useState para gerenciar estado
import { Link, useNavigate } from 'react-router-dom' // Link para navegação e useNavigate para redirecionamento
import styles from './Register.module.css' // Estilos CSS Module deste componente
import { useAuth } from '../../contexts/AuthContext' // Hook de autenticação

const Register = () => {
  // Estados para armazenar os valores dos campos de input do formulário de cadastro
  const [email, setEmail] = useState('') // Armazena o email do usuário
  const [fullName, setFullName] = useState('') // Armazena o nome completo
  const [username, setUsername] = useState('') // Armazena o nome de usuário
  const [password, setPassword] = useState('') // Armazena a senha
  const [error, setError] = useState('') // Armazena mensagens de erro
  const [loading, setLoading] = useState(false) // Controla estado de carregamento

  // Hook de navegação para redirecionar após cadastro
  const navigate = useNavigate()
  
  // Hook de autenticação
  const { signUp } = useAuth()

  // Função executada ao clicar no botão "Cadastre-se"
  const handleSubmit = async () => {
    // Limpa erros anteriores
    setError('')

    // Validação básica
    if (!email || !fullName || !username || !password) {
      setError('Por favor, preencha todos os campos!')
      return
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Por favor, insira um email válido!')
      return
    }

    // Validação de senha
    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres!')
      return
    }

    // Validação de username
    if (username.length < 3) {
      setError('O nome de usuário deve ter no mínimo 3 caracteres!')
      return
    }

    try {
      setLoading(true)
      
      // Tenta fazer cadastro
      const result = await signUp({
        email,
        fullName,
        username,
        password
      })
      
      if (result.success) {
        // Redireciona para o feed após cadastro bem-sucedido
        navigate('/feed')
      } else {
        // Mostra mensagem de erro
        setError(result.error)
      }
    } catch {
      setError('Ocorreu um erro ao criar sua conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    // Container principal que centraliza todo o conteúdo
    <div className={styles.container}>
      
      {/* Caixa principal do formulário de cadastro */}
      <div className={styles.signupBox}>
        
        {/* Container da logo/título do projeto */}
        <div className={styles.logoContainer}>
          <h1 className={styles.logo}>Relato Rápido</h1>
        </div>

        {/* Subtítulo explicativo sobre o propósito do cadastro */}
        <p className={styles.subtitle}>
          Cadastre-se para compartilhar seus relatos com amigos.
        </p>

        {/* Mensagem de erro (se houver) */}
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {/* Divisor visual com texto "OU" */}
        <div className={styles.divider}>
          <div className={styles.line}></div> {/* Linha esquerda */}
          <span className={styles.dividerText}>OU</span> {/* Texto central */}
          <div className={styles.line}></div> {/* Linha direita */}
        </div>

        {/* Container dos campos de input e botão */}
        <div className={styles.formContainer}>
          
          {/* Input para email */}
          <input
            type="email"
            placeholder="Email"
            className={styles.input}
            value={email} // Valor controlado pelo estado
            onChange={(e) => setEmail(e.target.value)} // Atualiza o estado ao digitar
            disabled={loading}
          />

          {/* Input para nome completo */}
          <input
            type="text"
            placeholder="Nome completo"
            className={styles.input}
            value={fullName} // Valor controlado pelo estado
            onChange={(e) => setFullName(e.target.value)} // Atualiza o estado ao digitar
            disabled={loading}
          />
          
          {/* Input para nome de usuário */}
          <input
            type="text"
            placeholder="Nome de usuário"
            className={styles.input}
            value={username} // Valor controlado pelo estado
            onChange={(e) => setUsername(e.target.value)} // Atualiza o estado ao digitar
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
          />

          {/* Texto informativo sobre compartilhamento de dados */}
          <p className={styles.terms}>
            As pessoas que usam nosso serviço podem ter carregado suas informações de contato no Relato Rápido. <a href="#" className={styles.link}>Saiba mais</a>
          </p>

          {/* Texto com termos de uso e políticas */}
          <p className={styles.terms}>
            Ao se cadastrar, você concorda com nossos <a href="#" className={styles.link}>Termos</a>, <a href="#" className={styles.link}>Política de Privacidade</a> e <a href="#" className={styles.link}>Política de Cookies</a>.
          </p>

          {/* Botão de submit do cadastro */}
          <button 
            onClick={handleSubmit} 
            className={styles.signupButton}
            disabled={loading}
          >
            {loading ? 'Cadastrando...' : 'Cadastre-se'}
          </button>
        </div>
      </div>

      {/* Caixa inferior com link para login */}
      <div className={styles.loginBox}>
        <p className={styles.loginText}>
          {/* Link que navega para a página de login usando React Router */}
          Tem uma conta? <Link to="/login" className={styles.loginLink}>Conecte-se</Link>
        </p>
      </div>
    </div>
  )
}

// Exporta o componente para ser usado em outros arquivos
export default Register