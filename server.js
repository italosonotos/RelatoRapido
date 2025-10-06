import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3030

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'dist')))

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor funcionando!' })
})

// Rota para servir o React app - MUDANÇA AQUI
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// Inicia o servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
  console.log(`Acesso remoto: http://<SEU_IP>:${PORT}`)
})