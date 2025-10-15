import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotifications } from '../../hooks/useNotifications'
import styles from './NotificationBell.module.css'

const NotificationBell = () => {
  const navigate = useNavigate()
  const { unreadCount } = useNotifications()

  return (
    <button 
      className={styles.bellButton}
      onClick={() => navigate('/notifications')}
      aria-label="Notificações"
    >
      {/* Ícone de sino/notificação */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      </svg>

      {/* Badge com contador */}
      {unreadCount > 0 && (
        <span className={styles.badge}>
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  )
}

export default NotificationBell






