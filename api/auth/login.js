import { loginWithPassword } from '../../server/jwtAuth.js'

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.status(405).json({
      code: 405,
      message: 'Method Not Allowed',
    })
    return
  }

  const result = await loginWithPassword(request.body || {})
  response.status(result.status).json(result.body)
}
