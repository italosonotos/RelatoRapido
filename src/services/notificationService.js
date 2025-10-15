import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  getDocs,
  updateDoc,
  doc,
  writeBatch,
  onSnapshot
} from 'firebase/firestore'
import { db } from '../firebase/config'

// ===== CRIAR NOTIFICAÇÃO DE CURTIDA =====
export const createLikeNotification = async ({
  postOwnerId,     // Dono do post que vai receber a notificação
  likerId,         // Quem curtiu
  likerName,
  likerAvatar,
  postId,
  postImage = null
}) => {
  try {
    // Não notifica se a pessoa curtiu o próprio post
    if (postOwnerId === likerId) {
      return { success: true, skipped: true }
    }

    const notificationData = {
      recipientId: postOwnerId,
      senderId: likerId,
      senderName: likerName,
      senderAvatar: likerAvatar,
      type: 'like',
      postId,
      postImage,
      message: 'curtiu seu post',
      read: false,
      createdAt: new Date().toISOString()
    }

    const notificationsRef = collection(db, 'notifications')
    const docRef = await addDoc(notificationsRef, notificationData)

    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Erro ao criar notificação de curtida:', error)
    return { success: false, error: error.message }
  }
}

// ===== CRIAR NOTIFICAÇÃO DE COMENTÁRIO =====
export const createCommentNotification = async ({
  postOwnerId,        // Dono do post
  commenterId,        // Quem comentou
  commenterName,
  commenterAvatar,
  postId,
  commentText,        // Texto do comentário
  postImage = null
}) => {
  try {
    // Não notifica se a pessoa comentou no próprio post
    if (postOwnerId === commenterId) {
      return { success: true, skipped: true }
    }

    // Limita o preview do comentário a 50 caracteres
    const commentPreview = commentText.length > 50 
      ? commentText.substring(0, 50) + '...' 
      : commentText

    const notificationData = {
      recipientId: postOwnerId,
      senderId: commenterId,
      senderName: commenterName,
      senderAvatar: commenterAvatar,
      type: 'comment',
      postId,
      postImage,
      message: `comentou: "${commentPreview}"`,
      read: false,
      createdAt: new Date().toISOString()
    }

    const notificationsRef = collection(db, 'notifications')
    const docRef = await addDoc(notificationsRef, notificationData)

    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Erro ao criar notificação de comentário:', error)
    return { success: false, error: error.message }
  }
}

// ===== BUSCAR NOTIFICAÇÕES DO USUÁRIO =====
export const getUserNotifications = async (userId, limitCount = 20) => {
  try {
    const notificationsRef = collection(db, 'notifications')
    const q = query(
      notificationsRef,
      where('recipientId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )

    const snapshot = await getDocs(q)
    const notifications = []

    snapshot.forEach(doc => {
      notifications.push({
        id: doc.id,
        ...doc.data()
      })
    })

    return { success: true, notifications }
  } catch (error) {
    console.error('Erro ao buscar notificações:', error)
    return { success: false, error: error.message, notifications: [] }
  }
}

// ===== ESCUTAR NOTIFICAÇÕES EM TEMPO REAL =====
export const subscribeToNotifications = (userId, callback) => {
  const notificationsRef = collection(db, 'notifications')
  const q = query(
    notificationsRef,
    where('recipientId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(30)
  )

  // Retorna função unsubscribe para limpar listener quando necessário
  return onSnapshot(q, (snapshot) => {
    const notifications = []
    snapshot.forEach(doc => {
      notifications.push({
        id: doc.id,
        ...doc.data()
      })
    })
    callback(notifications)
  }, (error) => {
    console.error('Erro ao escutar notificações:', error)
  })
}

// ===== MARCAR NOTIFICAÇÃO COMO LIDA =====
export const markAsRead = async (notificationId) => {
  try {
    const notificationRef = doc(db, 'notifications', notificationId)
    await updateDoc(notificationRef, {
      read: true
    })
    return { success: true }
  } catch (error) {
    console.error('Erro ao marcar como lida:', error)
    return { success: false, error: error.message }
  }
}

// ===== MARCAR TODAS COMO LIDAS =====
export const markAllAsRead = async (userId) => {
  try {
    const notificationsRef = collection(db, 'notifications')
    const q = query(
      notificationsRef,
      where('recipientId', '==', userId),
      where('read', '==', false)
    )

    const snapshot = await getDocs(q)
    
    if (snapshot.empty) {
      return { success: true }
    }

    const batch = writeBatch(db)

    snapshot.forEach(doc => {
      batch.update(doc.ref, { read: true })
    })

    await batch.commit()
    return { success: true }
  } catch (error) {
    console.error('Erro ao marcar todas como lidas:', error)
    return { success: false, error: error.message }
  }
}

// ===== CONTAR NOTIFICAÇÕES NÃO LIDAS =====
export const getUnreadCount = async (userId) => {
  try {
    const notificationsRef = collection(db, 'notifications')
    const q = query(
      notificationsRef,
      where('recipientId', '==', userId),
      where('read', '==', false)
    )

    const snapshot = await getDocs(q)
    return { success: true, count: snapshot.size }
  } catch (error) {
    console.error('Erro ao contar não lidas:', error)
    return { success: false, count: 0 }
  }
}

// ===== DELETAR NOTIFICAÇÃO ANTIGA (OPCIONAL - para limpeza) =====
export const deleteOldNotifications = async (userId, daysOld = 30) => {
  try {
    const dateLimit = new Date()
    dateLimit.setDate(dateLimit.getDate() - daysOld)
    
    const notificationsRef = collection(db, 'notifications')
    const q = query(
      notificationsRef,
      where('recipientId', '==', userId),
      where('createdAt', '<', dateLimit.toISOString())
    )

    const snapshot = await getDocs(q)
    const batch = writeBatch(db)

    snapshot.forEach(doc => {
      batch.delete(doc.ref)
    })

    await batch.commit()
    return { success: true, deleted: snapshot.size }
  } catch (error) {
    console.error('Erro ao deletar notificações antigas:', error)
    return { success: false, error: error.message }
  }
}