import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import styles from './Terms.module.css'

const Terms = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button 
          className="btn btn-ghost"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
          Voltar
        </button>
        <h1 className={styles.title}>Termos de Uso</h1>
        <div style={{ width: '80px' }}></div>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <p className={styles.lastUpdate}>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        <div className={styles.section}>
          <h2>1. Aceitação dos Termos</h2>
          <p>
            Ao acessar e usar o Relato Rápido, você concorda com estes Termos de Uso. 
            Se você não concorda com qualquer parte destes termos, não utilize nossa plataforma.
          </p>
        </div>

        <div className={styles.section}>
          <h2>2. Descrição do Serviço</h2>
          <p>
            O Relato Rápido é uma plataforma de rede social que permite aos usuários:
          </p>
          <ul>
            <li>Criar e compartilhar posts com texto e imagens</li>
            <li>Interagir com outros usuários através de curtidas e comentários</li>
            <li>Adicionar localização aos seus posts</li>
            <li>Personalizar seu perfil</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>3. Cadastro e Conta</h2>
          <p>
            Para usar o Relato Rápido, você deve:
          </p>
          <ul>
            <li>Ter pelo menos 13 anos de idade</li>
            <li>Fornecer informações verdadeiras e completas</li>
            <li>Manter a segurança da sua senha</li>
            <li>Notificar-nos imediatamente sobre qualquer uso não autorizado da sua conta</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>4. Conteúdo do Usuário</h2>
          <p>
            Você é responsável pelo conteúdo que publica. Ao postar conteúdo, você declara que:
          </p>
          <ul>
            <li>Possui os direitos necessários sobre o conteúdo</li>
            <li>O conteúdo não viola direitos de terceiros</li>
            <li>O conteúdo não é ilegal, ofensivo ou prejudicial</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>5. Conteúdo Proibido</h2>
          <p>
            É proibido publicar conteúdo que:
          </p>
          <ul>
            <li>Seja ilegal ou promova atividades ilegais</li>
            <li>Contenha discurso de ódio, discriminação ou violência</li>
            <li>Seja spam, golpe ou fraude</li>
            <li>Viole direitos de propriedade intelectual</li>
            <li>Contenha vírus ou código malicioso</li>
            <li>Exponha informações privadas de terceiros</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>6. Licença de Conteúdo</h2>
          <p>
            Ao publicar conteúdo no Relato Rápido, você nos concede uma licença mundial, 
            não exclusiva e gratuita para usar, armazenar, reproduzir e exibir seu conteúdo 
            exclusivamente para operar e melhorar a plataforma.
          </p>
        </div>

        <div className={styles.section}>
          <h2>7. Moderação e Remoção de Conteúdo</h2>
          <p>
            Reservamos o direito de:
          </p>
          <ul>
            <li>Remover qualquer conteúdo que viole estes termos</li>
            <li>Suspender ou encerrar contas que violem nossas políticas</li>
            <li>Modificar ou descontinuar qualquer parte do serviço</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>8. Privacidade</h2>
          <p>
            Sua privacidade é importante para nós. Consulte nossa{' '}
            <button 
              className={styles.link}
              onClick={() => navigate('/privacy')}
            >
              Política de Privacidade
            </button>
            {' '}para entender como coletamos e usamos seus dados.
          </p>
        </div>

        <div className={styles.section}>
          <h2>9. Limitação de Responsabilidade</h2>
          <p>
            O Relato Rápido é fornecido "como está". Não garantimos que o serviço será 
            ininterrupto ou livre de erros. Não nos responsabilizamos por:
          </p>
          <ul>
            <li>Perda de dados ou conteúdo</li>
            <li>Danos indiretos ou consequenciais</li>
            <li>Conteúdo publicado por outros usuários</li>
            <li>Interrupções ou falhas no serviço</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>10. Exclusão de Conta</h2>
          <p>
            Você pode excluir sua conta a qualquer momento através das configurações do perfil. 
            A exclusão é permanente e irreversível. Todo o seu conteúdo será removido.
          </p>
        </div>

        <div className={styles.section}>
          <h2>11. Alterações nos Termos</h2>
          <p>
            Podemos atualizar estes termos periodicamente. Alterações significativas serão 
            notificadas. O uso continuado da plataforma após mudanças constitui aceitação 
            dos novos termos.
          </p>
        </div>

        <div className={styles.section}>
          <h2>12. Lei Aplicável</h2>
          <p>
            Estes termos são regidos pelas leis brasileiras. Disputas serão resolvidas 
            nos tribunais do Brasil.
          </p>
        </div>

        <div className={styles.section}>
          <h2>13. Contato</h2>
          <p>
            Para dúvidas sobre estes termos, entre em contato:
          </p>
          <ul>
            <li>Email: contato@relatorapido.com.br</li>
            <li>Através do formulário de contato na plataforma</li>
          </ul>
        </div>

        <div className={styles.section}>
          <p className={styles.acceptance}>
            Ao usar o Relato Rápido, você confirma que leu, entendeu e concordou com estes Termos de Uso.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Terms