import React, { useState } from 'react'
import styles from './CreatePost.module.css'
import { X, Image, MapPin } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const CreatePost = ({ onClose, onSubmit }) => {
  const { user } = useAuth()
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [showLocation, setShowLocation] = useState(false)
  const [customLocation, setCustomLocation] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!content.trim()) {
      alert('Escreva algo antes de publicar!')
      return
    }

    const postData = {
      type: imageUrl ? 'image' : 'text',
      content: content.trim(),
      imageUrl: imageUrl || null,
      location: showLocation 
        ? (customLocation || `${user.city}, ${user.state}`)
        : null
    }

    onSubmit(postData)
    setContent('')
    setImageUrl('')
    setShowLocation(false)
    setCustomLocation('')
  }

  const hasUserLocation = user.city && user.state

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Criar publicação</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.userInfo}>
          <img src={user.avatar} alt={user.fullName} className={styles.avatar} />
          <div>
            <div className={styles.userName}>{user.fullName}</div>
            {showLocation && (
              <div className={styles.locationBadge}>
                <MapPin size={14} />
                <span>
                  {customLocation || (hasUserLocation ? `${user.city}, ${user.state}` : 'Adicione uma localização')}
                </span>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <textarea
            className={styles.textarea}
            placeholder={`No que você está pensando, ${user.fullName.split(' ')[0]}?`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            autoFocus
          />

          {imageUrl && (
            <div className={styles.imagePreview}>
              <img src={imageUrl} alt="Preview" />
              <button
                type="button"
                className={styles.removeImage}
                onClick={() => setImageUrl('')}
              >
                <X size={20} />
              </button>
            </div>
          )}

          {showLocation && (
            <div className={styles.locationInput}>
              <MapPin size={18} />
              <input
                type="text"
                placeholder={hasUserLocation ? `${user.city}, ${user.state}` : "Digite uma localização"}
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
              />
              <button
                type="button"
                onClick={() => {
                  setShowLocation(false)
                  setCustomLocation('')
                }}
              >
                <X size={18} />
              </button>
            </div>
          )}

          <div className={styles.divider}></div>

          <div className={styles.actions}>
            <span className={styles.addLabel}>Adicionar à publicação:</span>
            <div className={styles.actionButtons}>
              <button
                type="button"
                className={styles.actionButton}
                onClick={() => {
                  const url = prompt('Cole a URL da imagem:')
                  if (url) setImageUrl(url)
                }}
                title="Adicionar foto"
              >
                <Image size={24} />
              </button>

              <button
                type="button"
                className={styles.actionButton}
                onClick={() => setShowLocation(!showLocation)}
                title="Adicionar localização"
              >
                <MapPin size={24} />
              </button>
            </div>
          </div>

          <button type="submit" className={styles.submitButton}>
            Publicar
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreatePost