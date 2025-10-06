import React from 'react';
import { MessageSquare, Users, MapPin, TrendingUp } from 'lucide-react';
import styles from './Home.module.css';

export default function Home() {
  const handleEntrar = () => {
    // Navegar para /login
    window.location.href = '/login';
  };

  const handleCriarConta = () => {
    // Navegar para /cadastro
    window.location.href = '/cadastro';
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.logo}>
            Relato Rápido
          </h1>
          <button 
            onClick={handleEntrar}
            className={styles.headerButton}
          >
            Entrar
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className={styles.main}>
        <div className={styles.hero}>
          {/* Icon */}
          <div className={styles.iconContainer}>
            <MessageSquare className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>

          {/* Title */}
          <h2 className={styles.title}>
            Compartilhe seus relatos<br />
            <span className={styles.titleGradient}>
              e experiências
            </span>
          </h2>

          {/* Description */}
          <p className={styles.description}>
            sobre o que acontece na sua região.
          </p>

          <p className={styles.subdescription}>
            Dê voz às suas histórias, opiniões e situações do dia a dia.
          </p>

          {/* CTA Buttons */}
          <div className={styles.ctaButtons}>
            <button
              onClick={handleEntrar}
              className={styles.primaryButton}
            >
              Entrar
            </button>
            <button
              onClick={handleCriarConta}
              className={styles.secondaryButton}
            >
              Criar Conta
            </button>
          </div>
        </div>

        {/* Features */}
        <div className={styles.features}>
          {/* Feature 1 */}
          <div className={`${styles.featureCard} ${styles.featureCard1}`}>
            <div className={`${styles.featureIcon} ${styles.featureIcon1}`}>
              <Users className="w-6 h-6 md:w-7 md:h-7 text-blue-600" />
            </div>
            <h3 className={styles.featureTitle}>
              Conecte-se com pessoas
            </h3>
            <p className={styles.featureDescription}>
              Encontre e interaja com moradores da sua região que compartilham as mesmas experiências.
            </p>
          </div>

          {/* Feature 2 */}
          <div className={`${styles.featureCard} ${styles.featureCard2}`}>
            <div className={`${styles.featureIcon} ${styles.featureIcon2}`}>
              <MapPin className="w-6 h-6 md:w-7 md:h-7 text-purple-600" />
            </div>
            <h3 className={styles.featureTitle}>
              Descubra sua região
            </h3>
            <p className={styles.featureDescription}>
              Fique por dentro do que está acontecendo perto de você em tempo real.
            </p>
          </div>

          {/* Feature 3 */}
          <div className={`${styles.featureCard} ${styles.featureCard3}`}>
            <div className={`${styles.featureIcon} ${styles.featureIcon3}`}>
              <TrendingUp className="w-6 h-6 md:w-7 md:h-7 text-pink-600" />
            </div>
            <h3 className={styles.featureTitle}>
              Compartilhe histórias
            </h3>
            <p className={styles.featureDescription}>
              Dê voz às suas experiências e faça sua opinião ser ouvida pela comunidade.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className={styles.bottomCta}>
          <h3 className={styles.bottomCtaTitle}>
            Pronto para começar?
          </h3>
          <p className={styles.bottomCtaDescription}>
            Junte-se à comunidade e comece a compartilhar suas experiências hoje mesmo.
          </p>
          <button
            onClick={handleCriarConta}
            className={styles.bottomCtaButton}
          >
            Criar Conta Grátis
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p className={styles.footerText}>
          © 2025 Relato Rápido. Dando voz à sua comunidade.
        </p>
      </footer>
    </div>
  );
}