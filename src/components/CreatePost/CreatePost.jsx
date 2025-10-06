import React, { useState } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../../firebase/config'
import styles from './CreatePost.module.css'

const CreatePost = ({ onClose, onSubmit }) => {
  const [postType, setPostType] = useState('text')
  const [content, setContent] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploading, setUploading] = useState(false)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (postType === 'text' && !content.trim()) {
      alert('Por favor, escreva algo!')
      return
    }

    if (postType === 'image' && !imageFile) {
      alert('Por favor, selecione uma imagem!')
      return
    }

    setUploading(true)

    try {
      let imageUrl = null

      // Upload da imagem para o Firebase Storage
      if (postType === 'image' && imageFile) {
        const storageRef = ref(storage, `posts/${Date.now()}_${imageFile.name}`)
        const snapshot = await uploadBytes(storageRef, imageFile)
        imageUrl = await getDownloadURL(snapshot.ref)
      }

      const newPost = {
        type: postType,
        content: content.trim(),
        imageUrl: imageUrl
      }

      await onSubmit(newPost)
      
      setContent('')
      setImageFile(null)
      setImagePreview(null)
    } catch (error) {
      console.error('Erro ao criar post:', error)
      alert('Erro ao criar post. Tente novamente.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Criar Novo Post</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.typeSelector}>
            <button
              type="button"
              className={`${styles.typeButton} ${postType === 'text' ? styles.active : ''}`}
              onClick={() => setPostType('text')}
            >
              📝 Texto
            </button>
            <button
              type="button"
              className={`${styles.typeButton} ${postType === 'image' ? styles.active : ''}`}
              onClick={() => setPostType('image')}
            >
              🖼️ Imagem
            </button>
          </div>

          <textarea
            className={styles.textarea}
            placeholder={postType === 'text' ? 'Escreva seu relato...' : 'Adicione uma legenda...'}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            disabled={uploading}
          />

          {postType === 'image' && (
            <div className={styles.imageSection}>
              {!imagePreview ? (
                <label className={styles.imageLabel}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={styles.imageInput}
                    disabled={uploading}
                  />
                  <div className={styles.imagePlaceholder}>
                    📷 Clique para selecionar uma imagem
                  </div>
                </label>
              ) : (
                <div className={styles.imagePreviewContainer}>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className={styles.imagePreview}
                  />
                  <button
                    type="button"
                    className={styles.removeImageButton}
                    onClick={() => {
                      setImageFile(null)
                      setImagePreview(null)
                    }}
                    disabled={uploading}
                  >
                    Remover imagem
                  </button>
                </div>
              )}
            </div>
          )}

          <div className={styles.actions}>
            <button 
              type="button" 
              className={styles.cancelButton}
              onClick={onClose}
              disabled={uploading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={uploading}
            >
              {uploading ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePost