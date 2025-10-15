import {
  USER_VALIDATION,
  POST_VALIDATION,
  COMMENT_VALIDATION,
  IMAGE_VALIDATION,
  ERROR_MESSAGES
} from './constants'

// ===== VALIDAÇÃO DE USUÁRIO =====
export const validateUser = (userData) => {
  const errors = {}

  // Nome completo
  if (!userData.fullName || userData.fullName.trim().length === 0) {
    errors.fullName = ERROR_MESSAGES.REQUIRED(USER_VALIDATION.FULL_NAME.LABEL)
  } else if (userData.fullName.trim().length < USER_VALIDATION.FULL_NAME.MIN) {
    errors.fullName = ERROR_MESSAGES.MIN_LENGTH(
      USER_VALIDATION.FULL_NAME.LABEL,
      USER_VALIDATION.FULL_NAME.MIN
    )
  } else if (userData.fullName.length > USER_VALIDATION.FULL_NAME.MAX) {
    errors.fullName = ERROR_MESSAGES.MAX_LENGTH(
      USER_VALIDATION.FULL_NAME.LABEL,
      USER_VALIDATION.FULL_NAME.MAX
    )
  }

  // Username
  if (!userData.username || userData.username.trim().length === 0) {
    errors.username = ERROR_MESSAGES.REQUIRED(USER_VALIDATION.USERNAME.LABEL)
  } else if (userData.username.length < USER_VALIDATION.USERNAME.MIN) {
    errors.username = ERROR_MESSAGES.MIN_LENGTH(
      USER_VALIDATION.USERNAME.LABEL,
      USER_VALIDATION.USERNAME.MIN
    )
  } else if (userData.username.length > USER_VALIDATION.USERNAME.MAX) {
    errors.username = ERROR_MESSAGES.MAX_LENGTH(
      USER_VALIDATION.USERNAME.LABEL,
      USER_VALIDATION.USERNAME.MAX
    )
  } else if (!USER_VALIDATION.USERNAME.REGEX.test(userData.username)) {
    errors.username = ERROR_MESSAGES.INVALID_USERNAME
  }

  // Email
  if (!userData.email || userData.email.trim().length === 0) {
    errors.email = ERROR_MESSAGES.REQUIRED(USER_VALIDATION.EMAIL.LABEL)
  } else if (!USER_VALIDATION.EMAIL.REGEX.test(userData.email)) {
    errors.email = ERROR_MESSAGES.INVALID_EMAIL
  } else if (userData.email.length > USER_VALIDATION.EMAIL.MAX) {
    errors.email = ERROR_MESSAGES.MAX_LENGTH(
      USER_VALIDATION.EMAIL.LABEL,
      USER_VALIDATION.EMAIL.MAX
    )
  }

  // Senha (apenas se fornecida - para cadastro)
  if (userData.password !== undefined) {
    if (!userData.password || userData.password.length === 0) {
      errors.password = ERROR_MESSAGES.REQUIRED(USER_VALIDATION.PASSWORD.LABEL)
    } else if (userData.password.length < USER_VALIDATION.PASSWORD.MIN) {
      errors.password = ERROR_MESSAGES.MIN_LENGTH(
        USER_VALIDATION.PASSWORD.LABEL,
        USER_VALIDATION.PASSWORD.MIN
      )
    } else if (userData.password.length > USER_VALIDATION.PASSWORD.MAX) {
      errors.password = ERROR_MESSAGES.MAX_LENGTH(
        USER_VALIDATION.PASSWORD.LABEL,
        USER_VALIDATION.PASSWORD.MAX
      )
    }
  }

  // Bio (opcional, mas com limite)
  if (userData.bio && userData.bio.length > USER_VALIDATION.BIO.MAX) {
    errors.bio = ERROR_MESSAGES.MAX_LENGTH(
      USER_VALIDATION.BIO.LABEL,
      USER_VALIDATION.BIO.MAX
    )
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// ===== VALIDAÇÃO DE POST =====
export const validatePost = (postData) => {
  const errors = {}

  // Conteúdo/legenda
  if (!postData.content || postData.content.trim().length === 0) {
    errors.content = ERROR_MESSAGES.REQUIRED(POST_VALIDATION.CONTENT.LABEL)
  } else if (postData.content.length > POST_VALIDATION.CONTENT.MAX) {
    errors.content = ERROR_MESSAGES.MAX_LENGTH(
      POST_VALIDATION.CONTENT.LABEL,
      POST_VALIDATION.CONTENT.MAX
    )
  }

  // Imagem (obrigatória)
  if (!postData.imageUrl && !postData.imageFile) {
    errors.image = ERROR_MESSAGES.IMAGE_REQUIRED
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// ===== VALIDAÇÃO DE COMENTÁRIO =====
export const validateComment = (text) => {
  const errors = {}

  if (!text || text.trim().length === 0) {
    errors.text = ERROR_MESSAGES.REQUIRED(COMMENT_VALIDATION.TEXT.LABEL)
  } else if (text.length > COMMENT_VALIDATION.TEXT.MAX) {
    errors.text = ERROR_MESSAGES.MAX_LENGTH(
      COMMENT_VALIDATION.TEXT.LABEL,
      COMMENT_VALIDATION.TEXT.MAX
    )
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// ===== VALIDAÇÃO DE ARQUIVO DE IMAGEM =====
export const validateImageFile = (file, options = {}) => {
  const errors = {}
  
  const maxSize = options.isAvatar 
    ? IMAGE_VALIDATION.AVATAR_MAX_SIZE 
    : IMAGE_VALIDATION.MAX_SIZE
  
  // Verifica se é um arquivo
  if (!file) {
    errors.file = ERROR_MESSAGES.REQUIRED(IMAGE_VALIDATION.LABEL)
    return { isValid: false, errors }
  }

  // Tipo do arquivo
  if (!IMAGE_VALIDATION.ALLOWED_TYPES.includes(file.type)) {
    const allowedExtensions = IMAGE_VALIDATION.ALLOWED_TYPES.map(type => 
      type.split('/')[1].toUpperCase()
    )
    errors.type = ERROR_MESSAGES.INVALID_FILE_TYPE(allowedExtensions)
  }

  // Tamanho máximo
  if (file.size > maxSize) {
    errors.size = ERROR_MESSAGES.FILE_TOO_LARGE(maxSize)
  }

  // Tamanho mínimo
  if (file.size < IMAGE_VALIDATION.MIN_SIZE) {
    errors.size = ERROR_MESSAGES.FILE_TOO_SMALL(IMAGE_VALIDATION.MIN_SIZE)
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// ===== VALIDAÇÃO RÁPIDA DE CAMPO ÚNICO =====
export const validateField = (fieldName, value, rules) => {
  if (rules.required && (!value || value.trim().length === 0)) {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED(rules.label || fieldName) }
  }

  if (rules.min && value.length < rules.min) {
    return { isValid: false, error: ERROR_MESSAGES.MIN_LENGTH(rules.label || fieldName, rules.min) }
  }

  if (rules.max && value.length > rules.max) {
    return { isValid: false, error: ERROR_MESSAGES.MAX_LENGTH(rules.label || fieldName, rules.max) }
  }

  if (rules.regex && !rules.regex.test(value)) {
    return { isValid: false, error: ERROR_MESSAGES.INVALID_FORMAT(rules.label || fieldName) }
  }

  return { isValid: true, error: null }
}