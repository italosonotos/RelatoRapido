// ProfileEdit.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ProfileEdit.module.css'
import { useAuth } from '../../contexts/AuthContext'

const ProfileEdit = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  
  const [previewImage, setPreviewImage] = useState(user.avatar)
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Função para lidar com seleção de imagem
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      // Cria preview da imagem
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Função para salvar alterações
  const handleSave = async () => {
    setLoading(true)
    setSuccess(false)

    try {
      // TODO: Integração Firebase - Upload para Storage
      // const storageRef = ref(storage, `avatars/${user.id}`)
      // const snapshot = await uploadBytes(storageRef, imageFile)
      // const avatarUrl = await getDownloadURL(snapshot.ref)

      // Atualiza usuário no localStorage
      const updatedUser = {
        ...user,
        avatar: previewImage
      }

      // Atualiza no localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser))

      // Atualiza também na lista de usuários
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const updatedUsers = users.map(u => 
        u.id === user.id ? { ...u, avatar: previewImage } : u
      )
      localStorage.setItem('users', JSON.stringify(updatedUsers))

      setSuccess(true)
      
      // Recarrega a página para atualizar o contexto
      setTimeout(() => {
        window.location.reload()
      }, 1500)

    } catch  {
      alert('Erro ao salvar foto. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate('/feed')}>
          ← Voltar
        </button>
        <h1 className={styles.title}>Editar Perfil</h1>
        <button className={styles.logoutButton} onClick={() => {
          signOut()
          navigate('/login')
        }}>
          Sair
        </button>
      </div>

      <div className={styles.profileBox}>
        <div className={styles.avatarSection}>
          <img 
            src={previewImage} 
            alt={user.fullName}
            className={styles.avatar}
          />
          
          <label className={styles.uploadLabel}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.fileInput}
            />
            <span className={styles.uploadButton}>Alterar Foto</span>
          </label>
        </div>

        <div className={styles.userDetails}>
          <div className={styles.infoRow}>
            <span className={styles.label}>Nome:</span>
            <span className={styles.value}>{user.fullName}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Usuário:</span>
            <span className={styles.value}>@{user.username}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Email:</span>
            <span className={styles.value}>{user.email}</span>
          </div>
        </div>

        {success && (
          <div className={styles.successMessage}>
            Foto atualizada com sucesso!
          </div>
        )}

        {imageFile && (
          <button 
            className={styles.saveButton}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        )}
      </div>
    </div>
  )
}

export default ProfileEdit