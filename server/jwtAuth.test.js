import { describe, expect, it } from 'vitest'
import {
  createJwt,
  getProfileFromAuthorization,
  loginWithPassword,
  verifyJwt,
} from './jwtAuth.js'

describe('server jwt auth service', () => {
  it('signs and verifies a real HS256 JWT on the server side', () => {
    const token = createJwt({
      id: 1,
      username: 'admin',
      name: 'Noir Editor',
      role: 'Administrator',
    })

    const payload = verifyJwt(token)

    expect(token.split('.')).toHaveLength(3)
    expect(payload.username).toBe('admin')
    expect(payload.iss).toBe('noir-archive-api')
  })

  it('logs in with the server account and returns a signed JWT', async () => {
    const result = await loginWithPassword({
      username: 'admin',
      password: 'noir2026',
    })

    expect(result.status).toBe(200)
    expect(result.body.data.token.split('.')).toHaveLength(3)
    expect(result.body.data.user.name).toBe('Noir Editor')
  })

  it('rejects an invalid password', async () => {
    const result = await loginWithPassword({
      username: 'admin',
      password: 'wrong-password',
    })

    expect(result.status).toBe(401)
    expect(result.body.code).toBe(401)
  })

  it('rejects an invalid bearer token when reading profile', () => {
    const result = getProfileFromAuthorization('Bearer invalid-token')

    expect(result.status).toBe(401)
    expect(result.body.code).toBe(401)
  })
})
