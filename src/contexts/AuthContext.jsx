// AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react'
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth'
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  updateDoc
} from 'firebase/firestore'
import { auth, db } from '../firebase/config'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Observa mudanças no estado de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        if (userDoc.exists()) {
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email,
            ...userDoc.data()
          })
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  // Função de cadastro
  const signUp = async ({ email, fullName, username, password, city, state, neighborhood }) => {
    try {
      const usersRef = collection(db, 'users')
      const usernameQuery = query(usersRef, where('username', '==', username))
      const usernameSnapshot = await getDocs(usernameQuery)

      if (!usernameSnapshot.empty) {
        return { success: false, error: 'Este nome de usuário já está em uso!' }
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user

      const avatarNumber = Math.floor(Math.random() * 10) + 1
      const avatar = `https://i.pravatar.cc/150?img=${avatarNumber}`

      const userData = {
        email,
        fullName,
        username,
        avatar,
        city: city || null,
        state: state || null,
        neighborhood: neighborhood || null,
        bio: '',
        createdAt: new Date().toISOString()
      }

      await setDoc(doc(db, 'users', firebaseUser.uid), userData)

      setUser({
        id: firebaseUser.uid,
        ...userData
      })

      return { success: true }
    } catch (error) {
      console.error('Erro no cadastro:', error)
      
      let errorMessage = 'Erro ao criar conta. Tente novamente.'
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este email já está em uso!'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido!'
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'A senha deve ter no mínimo 6 caracteres!'
      }
      
      return { 
        success: false, 
        error: errorMessage
      }
    }
  }

  // Função de login
  const signIn = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return { success: true }
    } catch (error) {
      let errorMessage = 'Erro ao fazer login'
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Email ou senha incorretos'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido'
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Email ou senha incorretos'
      }
      
      return { success: false, error: errorMessage }
    }
  }

  // Atualizar perfil do usuário 
  const updateUserProfile = async (profileData) => {
    try {
      if (!user || !user.id) {
        throw new Error('Usuário não autenticado')
      }

      const userRef = doc(db, 'users', user.id)
      
      // Atualiza apenas os campos fornecidos
      await updateDoc(userRef, {
        fullName: profileData.fullName,
        username: profileData.username,
        avatar: profileData.avatar,
        updatedAt: new Date().toISOString()
      })

      // Atualiza o estado local
      setUser({
        ...user,
        fullName: profileData.fullName,
        username: profileData.username,
        avatar: profileData.avatar
      })

      return { success: true }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      return { 
        success: false, 
        error: 'Erro ao atualizar perfil. Tente novamente.' 
      }
    }
  }

  // Função de logout
  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateUserProfile,  // ← ADICIONE AQUI
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export default AuthContext