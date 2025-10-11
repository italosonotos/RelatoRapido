import React, { useState, useEffect } from 'react'
import styles from './SearchUsers.module.css'
import { Search, X } from 'lucide-react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useNavigate } from 'react-router-dom'

const SearchUsers = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [users, setUsers] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      searchUsers()
    } else {
      setUsers([])
    }
  }, [searchTerm])

  const searchUsers = async () => {
    setIsSearching(true)
    try {
      const usersRef = collection(db, 'users')
      const q = query(usersRef)
      const querySnapshot = await getDocs(q)
      
      const allUsers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      // Filtrar pelo termo de busca
      const filtered = allUsers.filter(user => 
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )

      setUsers(filtered)
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
    }
    setIsSearching(false)
  }

  const handleClearSearch = () => {
    setSearchTerm('')
    setUsers([])
  }

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`)
    handleClearSearch()
  }

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchBar}>
        <Search size={18} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Buscar usuários..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        {searchTerm && (
          <button 
            className={styles.clearButton}
            onClick={handleClearSearch}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {searchTerm && (
        <div className={styles.resultsDropdown}>
          {isSearching ? (
            <div className={styles.loading}>Buscando...</div>
          ) : users.length > 0 ? (
            users.map(user => (
              <div 
                key={user.id}
                className={styles.userResult}
                onClick={() => handleUserClick(user.id)}
              >
                <img 
                  src={user.avatar} 
                  alt={user.fullName}
                  className={styles.userAvatar}
                />
                <div className={styles.userInfo}>
                  <div className={styles.userName}>{user.fullName}</div>
                  <div className={styles.userEmail}>{user.email}</div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noResults}>
              Nenhum usuário encontrado
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchUsers