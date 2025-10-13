import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, AtSign, Trash2, LogOut, ArrowLeft, Edit, ChevronDown, ChevronUp } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { db } from '../../firebase/config'
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  doc 
} from 'firebase/firestore'
import { deleteUser } from 'firebase/auth'
import styles from './ProfileEdit.module.css'
import Post from '../Post/Post'

const Profile = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [userPosts, setUserPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [showDangerZone, setShowDangerZone] = useState(false)

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const q = query(
          collection(db, 'posts'), 
          where('userId', '==', user.id)
        )
        const querySnapshot = await getDocs(q)
        const posts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date()
        }))
        setUserPosts(posts.sort((a, b) => b.timestamp - a.timestamp))
      } catch (error) {
        console.error('Erro ao buscar posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserPosts()
  }, [user.id])

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      '⚠️ ATENÇÃO: Esta ação é irreversível!\n\n' +
      'Ao excluir sua conta:\n' +
      '• Todos os seus posts serão deletados\n' +
      '• Todos os seus comentários serão removidos\n' +
      '• Suas curtidas serão apagadas\n' +
      '• Você será desconectado imediatamente\n\n' +
      'Tem certeza que deseja continuar?'
    )

    if (!confirmDelete) return

    const confirmPassword = window.prompt(
      'Por favor, digite "DELETAR" para confirmar a exclusão da conta:'
    )

    if (confirmPassword !== 'DELETAR') {
      alert('Confirmação incorreta. Conta não foi excluída.')
      return
    }

    setDeleting(true)

    try {
      const postsQuery = query(
        collection(db, 'posts'),
        where('userId', '==', user.id)
      )
      const postsSnapshot = await getDocs(postsQuery)
      
      const deletePromises = postsSnapshot.docs.map(postDoc => 
        deleteDoc(doc(db, 'posts', postDoc.id))
      )
      await Promise.all(deletePromises)

      await deleteDoc(doc(db, 'users', user.id))

      const auth = (await import('firebase/auth')).getAuth()
      const currentUser = auth.currentUser
      if (currentUser) {
        await deleteUser(currentUser)
      }

      alert('Conta excluída com sucesso.')
      navigate('/login')
    } catch (error) {
      console.error('Erro ao deletar conta:', error)
      
      if (error.code === 'auth/requires-recent-login') {
        alert(
          'Por questões de segurança, você precisa fazer login novamente antes de excluir sua conta.\n\n' +
          'Por favor, saia e faça login novamente, depois tente excluir a conta.'
        )
      } else {
        alert('Erro ao excluir conta. Tente novamente.')
      }
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button 
          className="btn btn-ghost"
          onClick={() => navigate('/feed')}
        >
          <ArrowLeft size={20} />
          Voltar
        </button>

        <h1 className={styles.title}>Meu Perfil</h1>

        <button 
          className="btn btn-danger btn-sm"
          onClick={() => {
            signOut()
            navigate('/login')
          }}
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>

      {/* Profile Card */}
      <div className="card" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <div className={styles.profileHeader}>
          <img 
            src={user.avatar} 
            alt={user.fullName}
            className="avatar avatar-xl"
          />
          
          <div className={styles.profileInfo}>
            <div className={styles.profileNameRow}>
              <h2 className={styles.profileName}>{user.fullName}</h2>
              
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => navigate('/profile/edit')}
              >
                <Edit size={18} />
                Editar
              </button>
            </div>
            
            <div className={styles.profileDetails}>
              <div className={styles.detail}>
                <AtSign size={16} />
                <span>{user.username}</span>
              </div>
              
              <div className={styles.detail}>
                <Mail size={16} />
                <span>{user.email}</span>
              </div>
            </div>

            {/* Stats */}
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{userPosts.length}</span>
                <span className={styles.statLabel}>Posts</span>
              </div>
              
              <div className={styles.stat}>
                <span className={styles.statNumber}>
                  {userPosts.reduce((total, post) => total + post.likes.length, 0)}
                </span>
                <span className={styles.statLabel}>Curtidas</span>
              </div>
              
              <div className={styles.stat}>
                <span className={styles.statNumber}>
                  {userPosts.reduce((total, post) => total + (post.comments?.length || 0), 0)}
                </span>
                <span className={styles.statLabel}>Comentários</span>
              </div>
            </div>
          </div>
        </div>

        {/* Zona de Perigo Colapsável */}
        <div className={styles.dangerZone}>
          <button 
            className={styles.dangerToggle}
            onClick={() => setShowDangerZone(!showDangerZone)}
          >
            <div className={styles.dangerHeader}>
              <Trash2 size={20} />
              <span>Zona de Perigo</span>
            </div>
            {showDangerZone ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {showDangerZone && (
            <div className={styles.dangerContent}>
              <p className={styles.dangerDescription}>
                Ao excluir sua conta, todos os seus posts, comentários e curtidas serão permanentemente removidos.
                <strong> Esta ação não pode ser desfeita.</strong>
              </p>
              <button 
                className="btn btn-danger"
                onClick={handleDeleteAccount}
                disabled={deleting}
              >
                {deleting ? 'Excluindo...' : 'Excluir Conta Permanentemente'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Posts Section */}
      <div className={styles.postsSection}>
        <h2 className={styles.sectionTitle}>Meus Posts ({userPosts.length})</h2>
        
        {loading ? (
          <div className={styles.loading}>Carregando posts...</div>
        ) : userPosts.length === 0 ? (
          <div className={styles.emptyState}>
            <User size={48} color="var(--color-text-secondary)" />
            <p>Você ainda não fez nenhum post.</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/feed')}
            >
              Criar Primeiro Post
            </button>
          </div>
        ) : (
          <div className={styles.postsList}>
            {userPosts.map(post => (
              <Post
                key={post.id}
                post={post}
                currentUserId={user.id}
                onLike={() => {}}
                onAddComment={() => {}}
                onDelete={() => {
                  setUserPosts(prev => prev.filter(p => p.id !== post.id))
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile