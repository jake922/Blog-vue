import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getProfileApi, loginApi } from '../api/auth'
import { TOKEN_KEY, USER_KEY } from '../api/request'

const loadStoredUser = () => {
  const storedUser = localStorage.getItem(USER_KEY)

  if (!storedUser) {
    return null
  }

  try {
    return JSON.parse(storedUser)
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem(TOKEN_KEY) || '')
  const user = ref(loadStoredUser())
  const loginError = ref('')

  const isAuthenticated = computed(() => Boolean(token.value && user.value))

  const persistSession = () => {
    localStorage.setItem(TOKEN_KEY, token.value)
    localStorage.setItem(USER_KEY, JSON.stringify(user.value))
  }

  async function login(credentials) {
    loginError.value = ''

    try {
      const session = await loginApi(credentials)

      token.value = session.token
      user.value = session.user
      persistSession()

      return true
    } catch (error) {
      loginError.value =
        error instanceof Error
          ? error.message
          : '登录失败，请稍后重新尝试。'

      return false
    }
  }

  async function validateSession() {
    if (!token.value) {
      return false
    }

    try {
      const currentUser = await getProfileApi()

      user.value = currentUser
      persistSession()

      return true
    } catch {
      logout()
      return false
    }
  }

  function logout() {
    token.value = ''
    user.value = null
    loginError.value = ''

    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  function clearError() {
    loginError.value = ''
  }

  return {
    token,
    user,
    loginError,
    isAuthenticated,
    login,
    validateSession,
    logout,
    clearError,
  }
})