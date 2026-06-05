import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { TOKEN_KEY } from '../api/request'
import { useAuthStore } from './auth'

vi.mock('../api/auth', async () => {
  const jwtAuth = await import('../../server/jwtAuth.js')

  return {
    loginApi: vi.fn(async (credentials) => {
      const result = await jwtAuth.loginWithPassword(credentials)

      if (result.status !== 200) {
        throw new Error(result.body.message)
      }

      return result.body.data
    }),
    getProfileApi: vi.fn(async () => {
      const token = localStorage.getItem(TOKEN_KEY)
      const result = jwtAuth.getProfileFromAuthorization(`Bearer ${token}`)

      if (result.status !== 200) {
        throw new Error(result.body.message)
      }

      return result.body.data
    }),
  }
})

describe('auth store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('logs in through the real server JWT service and stores JWT session', async () => {
    const store = useAuthStore()

    const succeeded = await store.login({
      username: 'admin',
      password: 'noir2026',
    })

    expect(succeeded).toBe(true)
    expect(store.isAuthenticated).toBe(true)
    expect(store.user).toEqual({
      id: 1,
      username: 'admin',
      name: 'Noir Editor',
      role: 'Administrator',
    })

    const storedToken = localStorage.getItem('noir-archive-token')
    const storedUser = JSON.parse(localStorage.getItem('noir-archive-user'))

    expect(storedToken).toBeTruthy()
    expect(storedToken.split('.')).toHaveLength(3)
    expect(storedUser.name).toBe('Noir Editor')
  })

  it('rejects invalid login credentials and keeps the user logged out', async () => {
    const store = useAuthStore()

    const succeeded = await store.login({
      username: 'admin',
      password: 'wrong-password',
    })

    expect(succeeded).toBe(false)
    expect(store.isAuthenticated).toBe(false)
    expect(store.loginError).toBe('用户名或密码错误，请重新输入。')
    expect(localStorage.getItem('noir-archive-token')).toBeNull()
  })

  it('validates a stored JWT session through the protected profile API', async () => {
    const store = useAuthStore()

    await store.login({
      username: 'admin',
      password: 'noir2026',
    })

    const sessionIsValid = await store.validateSession()

    expect(sessionIsValid).toBe(true)
    expect(store.isAuthenticated).toBe(true)
    expect(store.user.name).toBe('Noir Editor')
  })

  it('clears the session when an invalid JWT is rejected by the profile API', async () => {
    const store = useAuthStore()

    await store.login({
      username: 'admin',
      password: 'noir2026',
    })

    localStorage.setItem('noir-archive-token', 'invalid-token')

    const sessionIsValid = await store.validateSession()

    expect(sessionIsValid).toBe(false)
    expect(store.isAuthenticated).toBe(false)
    expect(store.token).toBe('')
    expect(store.user).toBeNull()
    expect(localStorage.getItem('noir-archive-token')).toBeNull()
    expect(localStorage.getItem('noir-archive-user')).toBeNull()
  })

  it('removes JWT session information after logout', async () => {
    const store = useAuthStore()

    await store.login({
      username: 'admin',
      password: 'noir2026',
    })

    store.logout()

    expect(store.isAuthenticated).toBe(false)
    expect(store.token).toBe('')
    expect(store.user).toBeNull()
    expect(localStorage.getItem('noir-archive-token')).toBeNull()
    expect(localStorage.getItem('noir-archive-user')).toBeNull()
  })
})
