import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotifications } from '../../hooks/useNotifications'
import { ArrowLeft, Bell } from 'lucide-react'
import styles from './otifications.module.css'

const Notifications = () => {
  const navigate = useNavigate()
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications()

  // Formata o tempo decorrido (ex: "há 2 horas")
  const getTimeAgo = (timestamp) => {
    const now = new Date()
    const notificationTime = new Date(timestamp)
    const diffInMs = now - notificationTime
    const diffInMinutes = Math.floor(diffInMs / 60000)
    const diffInHours = Math.floor(diffInMs / 3600000)
    const diffInDays = Math.floor(diffInMs / 86400000)

    if (diffInMinutes < 1) return 'agora'
    if (diffInMinutes < 60) return `há ${diffInMinutes}m`
    if (diffInHours < 24) return `há ${diffInHours}h`
    if (diffInDays === 1) return 'ontem'
    if (diffInDays < 7) return `há ${diffInDays}d`
    return notificationTime.toLocaleDateString('pt-BR')
  }

  const handleNotificationClick = async (notification) => {
    // Marca como lida
    if (!notification.read) {
      await markAsRead(notification.id)
    }

    // Navega para o post
    if (notification.postId) {
      navigate(`/post/${notification.postId}`)
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <button 
            className={styles.backButton}
            onClick={() => navigate('/feed')}
            title="Voltar"
          >
            <ArrowLeft size={24} />
          </button>
          <h2>Notificações</h2>
        </div>
        <div className={styles.loading}>Carregando notificações...</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/feed')}
          title="Voltar"
        >
          <ArrowLeft size={24} />
        </button>
        <h2>Notificações</h2>
        {unreadCount > 0 && (
          <button 
            className={styles.markAllButton}
            onClick={markAllAsRead}
          >
            Marcar todas como lidas
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className={styles.empty}>
          <Bell size={64} className={styles.emptyIcon} />
          <h3>Nenhuma notificação</h3>
          <p>Quando alguém curtir ou comentar em seus posts, você verá aqui!</p>
        </div>
      ) : (
        <div className={styles.notificationsList}>
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`${styles.notificationItem} ${!notification.read ? styles.unread : ''}`}
              onClick={() => handleNotificationClick(notification)}
            >
              {/* Avatar de quem fez a ação */}
              <img 
                src={notification.senderAvatar} 
                alt={notification.senderName}
                className={styles.avatar}
              />

              {/* Conteúdo da notificação */}
              <div className={styles.content}>
                <p className={styles.message}>
                  <strong>{notification.senderName}</strong> {notification.message}
                </p>
                <span className={styles.time}>
                  {getTimeAgo(notification.createdAt)}
                </span>
              </div>

              {/* Thumbnail do post (se houver) */}
              {notification.postImage && (
                <img 
                  src={notification.postImage} 
                  alt="Post"
                  className={styles.postThumbnail}
                />
              )}

              {/* Ícone de tipo */}
              <div className={styles.icon}>
                {notification.type === 'like' && '❤️'}
                {notification.type === 'comment' && '💬'}
              </div>

              {/* Indicador de não lida */}
              {!notification.read && (
                <div className={styles.unreadDot}></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Notifications










