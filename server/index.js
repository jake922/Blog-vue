import http from 'node:http'
import { getProfileFromAuthorization, loginWithPassword } from './jwtAuth.js'

const PORT = Number(process.env.PORT || 8787)

const sendJson = (response, status, body) => {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  })
  response.end(JSON.stringify(body))
}

const readJsonBody = async (request) => {
  const chunks = []

  for await (const chunk of request) {
    chunks.push(chunk)
  }

  if (chunks.length === 0) {
    return {}
  }

  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

const server = http.createServer(async (request, response) => {
  try {
    if (request.method === 'POST' && request.url === '/api/auth/login') {
      const body = await readJsonBody(request)
      const result = await loginWithPassword(body)
      sendJson(response, result.status, result.body)
      return
    }

    if (request.method === 'GET' && request.url === '/api/auth/profile') {
      const result = getProfileFromAuthorization(request.headers.authorization)
      sendJson(response, result.status, result.body)
      return
    }

    sendJson(response, 404, {
      code: 404,
      message: 'API 不存在。',
    })
  } catch {
    sendJson(response, 500, {
      code: 500,
      message: '服务器处理请求失败。',
    })
  }
})

server.listen(PORT, () => {
  console.log(`JWT auth API server running at http://localhost:${PORT}`)
})
