import { useState, useEffect } from 'react'
import { 
  subscribeToNotifications, 
  markAsRead, 
  markAllAsRead,
  getUnreadCount 
} from '../services/notificationService'
import { useAuth } from '../contexts/AuthContext'

export const useNotifications = () => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) {
      setNotifications([])
      setUnreadCount(0)
      setLoading(false)
      return
    }

    // Inscreve-se para receber notificações em tempo real
    const unsubscribe = subscribeToNotifications(user.id, (newNotifications) => {
      setNotifications(newNotifications)
      
      // Conta quantas não foram lidas
      const unread = newNotifications.filter(n => !n.read).length
      setUnreadCount(unread)
      
      setLoading(false)
    })

    // Cleanup: cancela inscrição quando componente desmonta
    return () => unsubscribe()
  }, [user?.id])

  // Marcar uma notificação específica como lida
  const handleMarkAsRead = async (notificationId) => {
    await markAsRead(notificationId)
  }

  // Marcar todas como lidas
  const handleMarkAllAsRead = async () => {
    if (user?.id) {
      await markAllAsRead(user.id)
    }
  }

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead
  }
}