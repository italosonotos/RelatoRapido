// Importações do Firebase
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA1oZUwAj7LV3j6tiJTp2GMwkDuLw7vwFA",
  authDomain: "relatorapido-7df2d.firebaseapp.com",
  projectId: "relatorapido-7df2d",
  storageBucket: "relatorapido-7df2d.firebasestorage.app",
  messagingSenderId: "486543002311",
  appId: "1:486543002311:web:8489669ab7cdfc17334ce2",
  measurementId: "G-Z9QDMPMLYN"
}

// Inicializa o Firebase
const app = initializeApp(firebaseConfig)

// Inicializa os serviços
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app