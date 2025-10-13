import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../../firebase/config'
import styles from './Feed.module.css'
import Post from '../Post/Post'
import CreatePost from '../CreatePost/CreatePost'
import QuickPost from '../QuickPost/QuickPost'
import SearchUsers from '../SearchUsers/SearchUsers'
import GoogleAd from '../GoogleAd/GoogleAd'
import { useAuth } from '../../contexts/AuthContext'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import { 
  Plus, 
  LogOut, 
  User
} from 'lucide-react'
import { 
  collection, 
  addDoc, 
  onSnapshot,  // ← MUDANÇA: usar onSnapshot em vez de getDocs
  query, 
  orderBy, 
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc
} from 'firebase/firestore'

const Feed = () => {
  const [posts, setPosts] = useState([])
  const [showCreatePost, setShowCreatePost] = useState(false)
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  // ⬇️ LISTENER EM TEMPO REAL ⬇️
  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'))
    
    // onSnapshot escuta mudanças em tempo real
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      }))
      setPosts(postsData)
    }, (error) => {
      console.error('Erro ao escutar posts:', error)
    })

    // Cleanup: para de escutar quando o componente desmonta
    return () => unsubscribe()
  }, [])

  const handleLogout = () => {
    signOut()
    navigate('/login')
  }

  const handleCreatePost = async (newPost) => {
    try {
      await addDoc(collection(db, 'posts'), {
        userId: user.id,
        userName: user.fullName,
        userAvatar: user.avatar,
        type: newPost.type,
        content: newPost.content,
        imageUrl: newPost.imageUrl,
        location: newPost.location,
        likes: [],
        comments: [], // ← Inicializa com array vazio
        timestamp: serverTimestamp()
      })
      
      setShowCreatePost(false)
    } catch (error) {
      console.error('Erro ao criar post:', error)
      alert('Erro ao criar post. Tente novamente.')
    }
  }

  const handleLike = async (postId) => {
    try {
      const postRef = doc(db, 'posts', postId)
      const postDoc = await getDoc(postRef)
      
      if (postDoc.exists()) {
        const postData = postDoc.data()
        const likes = postData.likes || []
        const hasLiked = likes.includes(user.id)
        
        if (hasLiked) {
          await updateDoc(postRef, {
            likes: arrayRemove(user.id)
          })
        } else {
          await updateDoc(postRef, {
            likes: arrayUnion(user.id)
          })
        }
      }
    } catch (error) {
      console.error('Erro ao curtir:', error)
    }
  }

  const handleAddComment = async (postId, commentText) => {
    try {
      const postRef = doc(db, 'posts', postId)
      
      const newComment = {
        id: Date.now().toString(),
        text: commentText,
        userName: user.fullName,
        userAvatar: user.avatar,
        userId: user.id,
        timestamp: new Date().toISOString()
      }
      
      await updateDoc(postRef, {
        comments: arrayUnion(newComment)
      })
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error)
      alert('Erro ao adicionar comentário. Tente novamente.')
    }
  }

  const handleDeletePost = async (postId) => {
    try {
      await deleteDoc(doc(db, 'posts', postId))
    } catch (error) {
      console.error('Erro ao deletar post:', error)
      alert('Erro ao deletar o post. Tente novamente.')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.logo}>Relato Rápido</h1>
        
        <SearchUsers />
        
        <div className={styles.headerActions}>
          <ThemeToggle />
          
          <div className={styles.iconButtons}>
            <button 
              className={styles.iconButton}
              onClick={() => setShowCreatePost(true)}
              title="Criar Post"
            >
              <Plus size={20} />
            </button>
            
            <button 
              className={styles.iconButton}
              onClick={() => navigate('/profile')}
              title="Perfil"
            >
              <User size={20} />
            </button>
            
            <button 
              className={styles.iconButton}
              onClick={handleLogout}
              title="Sair"
            >
              <LogOut size={20} />
            </button>
          </div>
          
          <div className={styles.userAvatar}>
            <img 
              src={user.avatar} 
              alt={user.fullName}
              onClick={() => navigate('/profile')}
            />
          </div>
        </div>
      </div>

      {showCreatePost && (
        <CreatePost
          onClose={() => setShowCreatePost(false)}
          onSubmit={handleCreatePost}
        />
      )}

      <div className={styles.feed}>
        <QuickPost onOpenCreatePost={() => setShowCreatePost(true)} />

        {posts.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Nenhum post ainda. Seja o primeiro a compartilhar!</p>
          </div>
        ) : (
          posts.map((post, index) => (
            <React.Fragment key={post.id}>
              <Post
                post={post}
                currentUserId={user.id}
                onLike={handleLike}
                onAddComment={handleAddComment}
                onDelete={handleDeletePost}
              />
              
              {(index + 1) % 5 === 0 && index < posts.length - 1 && (
                <div className={styles.adContainer}>
                  <GoogleAd slot="SEU_SLOT_ID" />
                </div>
              )}
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  )
}

export default Feed