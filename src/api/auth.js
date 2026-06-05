import request from './request'

export const loginApi = (credentials) => request.post('/auth/login', credentials)

export const getProfileApi = () => request.get('/auth/profile')
