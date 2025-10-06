// AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react'
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../Firebase/config'

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
        // Busca dados adicionais do usuário no Firestore
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
const signUp = async (userData) => {
  try {
    // Cria usuário no Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    )

    // Salva dados adicionais no Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      fullName: userData.fullName,
      username: userData.username,
      email: userData.email,
      avatar: 'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff',
      createdAt: new Date().toISOString()
    })

    return { success: true }
  } catch (error) {
    console.error('Erro completo no signUp:', error) // ADICIONE ESTA LINHA
    console.error('Código do erro:', error.code) // E ESTA TAMBÉM
    
    let errorMessage = 'Erro ao criar conta'
    
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'Este email já está em uso'
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'A senha deve ter pelo menos 6 caracteres'
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Email inválido'
    }
    
    return { success: false, error: errorMessage }
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
      }
      
      return { success: false, error: errorMessage }
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
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export default AuthContext