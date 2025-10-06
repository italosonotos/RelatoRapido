// Importações necessárias
import React, { useState } from 'react'
import styles from './Post.module.css'

const Post = ({ post, currentUserId, onLike, onAddComment, onDelete }) => {
  // Estado para controlar a visibilidade dos comentários
  const [showComments, setShowComments] = useState(false)
  
  // Estado para o texto do novo comentário
  const [commentText, setCommentText] = useState('')

  // Verifica se o usuário atual curtiu o post
  const hasLiked = post.likes.includes(currentUserId)

  // Verifica se o usuário atual é o autor do post
  const isPostAuthor = post.userId === currentUserId

  // Formata a data do post
  const formatDate = (date) => {
    const now = new Date()
    const postDate = new Date(date)
    const diffInMs = now - postDate
    const diffInMins = Math.floor(diffInMs / 60000)
    const diffInHours = Math.floor(diffInMs / 3600000)
    const diffInDays = Math.floor(diffInMs / 86400000)

    if (diffInMins < 1) return 'agora'
    if (diffInMins < 60) return `${diffInMins}m`
    if (diffInHours < 24) return `${diffInHours}h`
    if (diffInDays < 7) return `${diffInDays}d`
    return postDate.toLocaleDateString('pt-BR')
  }

  // Função para adicionar comentário
  const handleSubmitComment = (e) => {
    e.preventDefault()
    if (commentText.trim()) {
      onAddComment(post.id, commentText.trim())
      setCommentText('')
    }
  }

  // Função para excluir o post
  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir este post?')) {
      onDelete(post.id)
    }
  }

  return (
    <div className={styles.postContainer}>
      {/* Header do post com informações do usuário */}
      <div className={styles.postHeader}>
        <div className={styles.postHeaderLeft}>
          <img 
            src={post.userAvatar} 
            alt={post.userName}
            className={styles.avatar}
          />
          <div className={styles.userInfo}>
            <span className={styles.userName}>{post.userName}</span>
            <span className={styles.timestamp}>{formatDate(post.timestamp)}</span>
          </div>
        </div>

        {/* Botão de excluir (apenas para o autor do post) */}
        {isPostAuthor && (
          <button 
            className={styles.deleteButton}
            onClick={handleDelete}
            aria-label="Excluir post"
            
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        )}
      </div>

      {/* Conteúdo do post */}
      <div className={styles.postContent}>
        {/* Texto do post */}
        {post.content && (
          <p className={styles.postText}>{post.content}</p>
        )}

        {/* Imagem do post (se houver) */}
        {post.type === 'image' && post.imageUrl && (
          <img 
            src={post.imageUrl} 
            alt="Post" 
            className={styles.postImage}
          />
        )}
      </div>

      {/* Ações do post (curtir e comentar) */}
      <div className={styles.postActions}>
        {/* Botão de curtir */}
        <button 
          className={`${styles.actionButton} ${hasLiked ? styles.liked : ''}`}
          onClick={() => onLike(post.id)}
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill={hasLiked ? "#ed4956" : "none"}
            stroke={hasLiked ? "#ed4956" : "currentColor"}
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span>{post.likes.length}</span>
        </button>

        {/* Botão de comentar */}
        <button 
          className={styles.actionButton}
          onClick={() => setShowComments(!showComments)}
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>{post.comments?.length || 0}</span>
        </button>
      </div>

      {/* Seção de comentários */}
      {showComments && (
        <div className={styles.commentsSection}>
          {/* Lista de comentários */}
          {post.comments && post.comments.length > 0 && (
            <div className={styles.commentsList}>
              {post.comments.map(comment => (
                <div key={comment.id} className={styles.comment}>
                  <img 
                    src={comment.userAvatar} 
                    alt={comment.userName}
                    className={styles.commentAvatar}
                  />
                  <div className={styles.commentContent}>
                    <span className={styles.commentUserName}>{comment.userName}</span>
                    <p className={styles.commentText}>{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Formulário para adicionar comentário */}
          <form onSubmit={handleSubmitComment} className={styles.commentForm}>
            <input
              type="text"
              placeholder="Adicione um comentário..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className={styles.commentInput}
            />
            <button 
              type="submit"
              className={styles.commentSubmit}
              disabled={!commentText.trim()}
            >
              Publicar
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default Post