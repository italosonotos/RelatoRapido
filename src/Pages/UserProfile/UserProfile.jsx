import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { User, Mail, AtSign, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { db } from '../../firebase/config'
import { 
  collection, 
  query, 
  where, 
  getDocs,
  doc,
  getDoc
} from 'firebase/firestore'
import styles from './UserProfile.module.css'
import Post from '../../components/Post/Post'

const UserProfile = () => {
  const { userId } = useParams() // Pega o ID da URL
  const { user: currentUser } = useAuth()
  const navigate = useNavigate()
  
  const [profileUser, setProfileUser] = useState(null)
  const [userPosts, setUserPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Buscar dados do usuário
        const userDoc = await getDoc(doc(db, 'users', userId))
        
        if (!userDoc.exists()) {
          alert('Usuário não encontrado')
          navigate('/feed')
          return
        }

        setProfileUser({
          id: userDoc.id,
          ...userDoc.data()
        })

        // Buscar posts do usuário
        const q = query(
          collection(db, 'posts'), 
          where('userId', '==', userId)
        )
        const querySnapshot = await getDocs(q)
        const posts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date()
        }))
        setUserPosts(posts.sort((a, b) => b.timestamp - a.timestamp))
      } catch (error) {
        console.error('Erro ao buscar perfil:', error)
        alert('Erro ao carregar perfil')
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [userId, navigate])

  // Se for o próprio usuário, redireciona para /profile
  useEffect(() => {
    if (currentUser && userId === currentUser.id) {
      navigate('/profile')
    }
  }, [currentUser, userId, navigate])

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Carregando perfil...</div>
      </div>
    )
  }

  if (!profileUser) {
    return null
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

        <h1 className={styles.title}>Perfil</h1>

        <div style={{ width: '80px' }}></div>
      </div>

      {/* Profile Card */}
      <div className="card" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <div className={styles.profileHeader}>
          <img 
            src={profileUser.avatar} 
            alt={profileUser.fullName}
            className="avatar avatar-xl"
          />
          
          <div className={styles.profileInfo}>
            <h2 className={styles.profileName}>{profileUser.fullName}</h2>
            
            <div className={styles.profileDetails}>
              <div className={styles.detail}>
                <AtSign size={16} />
                <span>{profileUser.username}</span>
              </div>
              
              {profileUser.city && profileUser.state && (
                <div className={styles.detail}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>{profileUser.city}, {profileUser.state}</span>
                </div>
              )}
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
      </div>

      {/* Posts Section */}
      <div className={styles.postsSection}>
        <h2 className={styles.sectionTitle}>Posts de {profileUser.fullName} ({userPosts.length})</h2>
        
        {userPosts.length === 0 ? (
          <div className={styles.emptyState}>
            <User size={48} color="var(--color-text-secondary)" />
            <p>Este usuário ainda não fez nenhum post.</p>
          </div>
        ) : (
          <div className={styles.postsList}>
            {userPosts.map(post => (
              <Post
                key={post.id}
                post={post}
                currentUserId={currentUser.id}
                onLike={() => {}}
                onAddComment={() => {}}
                onDelete={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfile