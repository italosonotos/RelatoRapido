// ===== VALIDAÇÃO DE USUÁRIOS =====
export const USER_VALIDATION = {
  FULL_NAME: {
    MIN: 2,
    MAX: 100,
    LABEL: 'Nome completo'
  },
  USERNAME: {
    MIN: 3,
    MAX: 30,
    REGEX: /^[a-zA-Z0-9_]+$/,
    LABEL: 'Nome de usuário'
  },
  EMAIL: {
    MIN: 5,
    MAX: 100,
    REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    LABEL: 'Email'
  },
  PASSWORD: {
    MIN: 6,
    MAX: 128,
    LABEL: 'Senha'
  },
  BIO: {
    MAX: 500,
    LABEL: 'Bio'
  }
}

// ===== VALIDAÇÃO DE POSTS =====
export const POST_VALIDATION = {
  CONTENT: {
    MIN: 1,
    MAX: 5000,
    LABEL: 'Legenda'
  },
  LIKES_LIMIT: 10000,
  COMMENTS_LIMIT: 1000
}

// ===== VALIDAÇÃO DE COMENTÁRIOS =====
export const COMMENT_VALIDATION = {
  TEXT: {
    MIN: 1,
    MAX: 1000,
    LABEL: 'Comentário'
  }
}

// ===== VALIDAÇÃO DE IMAGENS =====
export const IMAGE_VALIDATION = {
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  MIN_SIZE: 10 * 1024, // 10KB
  AVATAR_MAX_SIZE: 2 * 1024 * 1024, // 2MB
  LABEL: 'Imagem'
}

// ===== MENSAGENS DE ERRO =====
export const ERROR_MESSAGES = {
  REQUIRED: (field) => `${field} é obrigatório`,
  MIN_LENGTH: (field, min) => `${field} deve ter pelo menos ${min} caracteres`,
  MAX_LENGTH: (field, max) => `${field} não pode exceder ${max} caracteres`,
  INVALID_FORMAT: (field) => `${field} inválido`,
  INVALID_EMAIL: 'Email inválido',
  INVALID_USERNAME: 'Username só pode conter letras, números e underscore',
  FILE_TOO_LARGE: (max) => `Arquivo muito grande. Máximo: ${formatBytes(max)}`,
  FILE_TOO_SMALL: (min) => `Arquivo muito pequeno. Mínimo: ${formatBytes(min)}`,
  INVALID_FILE_TYPE: (allowed) => `Apenas arquivos ${allowed.join(', ')} são permitidos`,
  IMAGE_REQUIRED: 'É necessário adicionar uma imagem'
}

// Helper para formatar bytes
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}