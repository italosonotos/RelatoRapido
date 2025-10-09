import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, Save, Camera } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import styles from './ProfileEdit.module.css'

const ProfileEdit = () => {
  const { user, updateUserProfile } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    fullName: user.fullName || '',
    username: user.username || '',
    avatar: user.avatar || ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({
          ...formData,
          avatar: reader.result
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    try {
      await updateUserProfile(formData)
      setSuccess(true)
      setTimeout(() => {
        navigate('/profile')
      }, 1500)
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      alert('Erro ao atualizar perfil. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/profile')}
        >
          <ArrowLeft size={20} />
          Voltar
        </button>

        <h1 className={styles.title}>Editar Perfil</h1>

        <button 
          className="btn btn-danger btn-sm"
          onClick={() => navigate('/profile')}
        >
          Cancelar
        </button>
      </div>

      {/* Profile Box */}
      <div className={styles.profileBox}>
        {success && (
          <div className={styles.successMessage}>
            ✓ Perfil atualizado com sucesso!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Avatar Section */}
          <div className={styles.avatarSection}>
            <img 
              src={formData.avatar} 
              alt={formData.fullName}
              className={styles.avatar}
            />
            
            <input
              type="file"
              id="avatar-upload"
              className={styles.fileInput}
              accept="image/*"
              onChange={handleAvatarChange}
            />
            
            <label htmlFor="avatar-upload" className={styles.uploadLabel}>
              <span className={styles.uploadButton}>
                <Camera size={18} />
                Alterar Foto
              </span>
            </label>
          </div>

          {/* User Details */}
          <div className={styles.userDetails}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Nome Completo</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="input"
                placeholder="Digite seu nome completo"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Nome de Usuário</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input"
                placeholder="Digite seu username"
              />
            </div>

            {/* Info somente leitura */}
            <div className={styles.infoRow}>
              <span className={styles.label}>Email:</span>
              <span className={styles.value}>{user.email}</span>
            </div>
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <button 
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? (
                'Salvando...'
              ) : (
                <>
                  <Save size={18} />
                  Salvar Alterações
                </>
              )}
            </button>

            <button 
              type="button"
              className="btn btn-outline btn-full"
              onClick={() => navigate('/profile')}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProfileEdit