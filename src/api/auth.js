import request from './request'

const adminAccount = {
  username: 'admin',
  password: 'noir2026',
  name: 'Noir Editor',
  role: 'Administrator',
}

const loggedInUser = {
  username: adminAccount.username,
  name: adminAccount.name,
  role: adminAccount.role,
}

const delay = (duration) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, duration)
  })

const encodeBase64Url = (value) => {
  const bytes = new TextEncoder().encode(JSON.stringify(value))
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('')

  return window
    .btoa(binary)
    .replaceAll('=', '')
    .replaceAll('+', '-')
    .replaceAll('/', '_')
}

const decodeBase64Url = (value) => {
  const normalized = value.replaceAll('-', '+').replaceAll('_', '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
  const binary = window.atob(padded)
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))

  return JSON.parse(new TextDecoder().decode(bytes))
}

const createMockJwt = (user) => {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  }

  const payload = {
    sub: user.username,
    name: user.name,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
  }

  const signature = window
    .btoa('noir-archive-demo-signature')
    .replaceAll('=', '')

  return `${encodeBase64Url(header)}.${encodeBase64Url(payload)}.${signature}`
}

const isValidToken = (token) => {
  try {
    const payloadPart = token.split('.')[1]

    if (!payloadPart) {
      return false
    }

    const payload = decodeBase64Url(payloadPart)

    return (
      payload.sub === adminAccount.username &&
      payload.exp > Math.floor(Date.now() / 1000)
    )
  } catch {
    return false
  }
}

const createMockResponse = (config, data) => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config,
  request: {},
})

const readAuthorizationToken = (config) => {
  const authorization =
    typeof config.headers?.get === 'function'
      ? config.headers.get('Authorization')
      : config.headers?.Authorization

  if (typeof authorization !== 'string') {
    return ''
  }

  return authorization.replace('Bearer ', '')
}

const loginAdapter = async (config) => {
  await delay(520)

  const credentials = JSON.parse(config.data || '{}')
  const isValidAccount =
    credentials.username === adminAccount.username &&
    credentials.password === adminAccount.password

  if (!isValidAccount) {
    return createMockResponse(config, {
      code: 1001,
      message: '用户名或密码错误，请重新输入。',
    })
  }

  return createMockResponse(config, {
    code: 0,
    data: {
      token: createMockJwt(loggedInUser),
      user: loggedInUser,
    },
  })
}

const profileAdapter = async (config) => {
  await delay(120)

  const token = readAuthorizationToken(config)

  if (!isValidToken(token)) {
    return createMockResponse(config, {
      code: 401,
      message: '登录状态已失效，请重新登录。',
    })
  }

  return createMockResponse(config, {
    code: 0,
    data: loggedInUser,
  })
}

export const loginApi = (credentials) =>
  request.post('/auth/login', credentials, {
    adapter: loginAdapter,
  })

export const getProfileApi = () =>
  request.get('/auth/profile', {
    adapter: profileAdapter,
  })