import React from 'react'
import styles from './QuickPost.module.css'
import { Video, Image, Smile } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const QuickPost = ({ onOpenCreatePost }) => {
  const { user } = useAuth()

  return (
    <div className={styles.quickPost}>
      <div className={styles.inputArea}>
        <img 
          src={user.avatar} 
          alt={user.fullName}
          className={styles.avatar}
        />
        <div 
          className={styles.fakeInput}
          onClick={onOpenCreatePost}
        >
          No que você está pensando, {user.fullName.split(' ')[0]}?
        </div>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.actions}>
        <button 
          className={styles.actionButton}
          onClick={onOpenCreatePost}
        >
          <Video size={20} className={styles.iconRed} />
          Vídeo ao vivo
        </button>

        <button 
          className={styles.actionButton}
          onClick={onOpenCreatePost}
        >
          <Image size={20} className={styles.iconGreen} />
          Foto/vídeo
        </button>

        <button 
          className={styles.actionButton}
          onClick={onOpenCreatePost}
        >
          <Smile size={20} className={styles.iconYellow} />
          Sentimento
        </button>
      </div>
    </div>
  )
}

export default QuickPost