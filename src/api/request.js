import axios from 'axios'

export const TOKEN_KEY = 'noir-archive-token'
export const USER_KEY = 'noir-archive-user'

const request = axios.create({
  baseURL: '/api',
  timeout: 5000,
})

const clearStoredSession = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY)

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

request.interceptors.response.use(
  (response) => {
    const payload = response.data

    if (payload?.code === 401) {
      clearStoredSession()
      return Promise.reject(
        new Error(payload.message || '登录状态已失效，请重新登录。'),
      )
    }

    if (payload?.code !== undefined && payload.code !== 0) {
      return Promise.reject(
        new Error(payload.message || '请求失败，请稍后重试。'),
      )
    }

    return payload?.data ?? payload
  },
  (error) => {
    if (error.response?.status === 401) {
      clearStoredSession()
    }

    return Promise.reject(error)
  },
)

export default request