import crypto from 'node:crypto'

const JWT_SECRET = process.env.JWT_SECRET || 'noir-archive-development-secret'
const ISSUER = 'noir-archive-api'
const AUDIENCE = 'noir-archive-admin'
const TOKEN_EXPIRES_IN_SECONDS = 60 * 60 * 8

const adminUser = {
  id: 1,
  username: 'admin',
  name: 'Noir Editor',
  role: 'Administrator',
}

// 演示账号密码：admin / noir2026
// 密码不以明文形式校验，而是通过 PBKDF2 哈希后再比较。
const passwordSalt = 'noir-archive-admin-salt'
const adminPasswordHash = crypto
  .pbkdf2Sync('noir2026', passwordSalt, 100_000, 64, 'sha512')
  .toString('hex')

const encodeBase64Url = (input) => {
  const value = typeof input === 'string' ? input : JSON.stringify(input)
  return Buffer.from(value)
    .toString('base64')
    .replaceAll('=', '')
    .replaceAll('+', '-')
    .replaceAll('/', '_')
}

const decodeBase64Url = (input) => {
  const normalized = input.replaceAll('-', '+').replaceAll('_', '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
  return Buffer.from(padded, 'base64').toString('utf8')
}

const sign = (content) =>
  crypto
    .createHmac('sha256', JWT_SECRET)
    .update(content)
    .digest('base64')
    .replaceAll('=', '')
    .replaceAll('+', '-')
    .replaceAll('/', '_')

const safeEqual = (left, right) => {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)

  if (leftBuffer.length !== rightBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer)
}

export const createJwt = (user) => {
  const now = Math.floor(Date.now() / 1000)
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  }

  const payload = {
    sub: String(user.id),
    username: user.username,
    name: user.name,
    role: user.role,
    iss: ISSUER,
    aud: AUDIENCE,
    iat: now,
    exp: now + TOKEN_EXPIRES_IN_SECONDS,
  }

  const encodedHeader = encodeBase64Url(header)
  const encodedPayload = encodeBase64Url(payload)
  const content = `${encodedHeader}.${encodedPayload}`
  const signature = sign(content)

  return `${content}.${signature}`
}

export const verifyJwt = (token) => {
  if (typeof token !== 'string') {
    throw new Error('Token 不存在。')
  }

  const parts = token.split('.')

  if (parts.length !== 3) {
    throw new Error('Token 格式错误。')
  }

  const [encodedHeader, encodedPayload, receivedSignature] = parts
  const expectedSignature = sign(`${encodedHeader}.${encodedPayload}`)

  if (!safeEqual(receivedSignature, expectedSignature)) {
    throw new Error('Token 签名无效。')
  }

  const header = JSON.parse(decodeBase64Url(encodedHeader))
  const payload = JSON.parse(decodeBase64Url(encodedPayload))

  if (header.alg !== 'HS256' || header.typ !== 'JWT') {
    throw new Error('Token 头部信息无效。')
  }

  if (payload.iss !== ISSUER || payload.aud !== AUDIENCE) {
    throw new Error('Token 签发方或受众无效。')
  }

  if (payload.exp <= Math.floor(Date.now() / 1000)) {
    throw new Error('Token 已过期。')
  }

  return payload
}

const verifyPassword = (password) => {
  const inputHash = crypto
    .pbkdf2Sync(password, passwordSalt, 100_000, 64, 'sha512')
    .toString('hex')

  return safeEqual(inputHash, adminPasswordHash)
}

export const loginWithPassword = async ({ username, password }) => {
  const accountIsValid =
    username === adminUser.username && verifyPassword(password || '')

  if (!accountIsValid) {
    return {
      status: 401,
      body: {
        code: 401,
        message: '用户名或密码错误，请重新输入。',
      },
    }
  }

  return {
    status: 200,
    body: {
      code: 0,
      data: {
        token: createJwt(adminUser),
        user: adminUser,
      },
    },
  }
}

export const extractBearerToken = (authorization = '') => {
  if (!authorization.startsWith('Bearer ')) {
    return ''
  }

  return authorization.slice('Bearer '.length)
}

export const getProfileFromAuthorization = (authorization = '') => {
  try {
    const token = extractBearerToken(authorization)
    const payload = verifyJwt(token)

    if (payload.username !== adminUser.username) {
      throw new Error('用户不存在。')
    }

    return {
      status: 200,
      body: {
        code: 0,
        data: adminUser,
      },
    }
  } catch (error) {
    return {
      status: 401,
      body: {
        code: 401,
        message:
          error instanceof Error
            ? error.message
            : '登录状态已失效，请重新登录。',
      },
    }
  }
}
