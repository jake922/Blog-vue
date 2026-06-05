import { getProfileFromAuthorization } from '../../server/jwtAuth.js'

export default function handler(request, response) {
  if (request.method !== 'GET') {
    response.status(405).json({
      code: 405,
      message: 'Method Not Allowed',
    })
    return
  }

  const result = getProfileFromAuthorization(request.headers.authorization)
  response.status(result.status).json(result.body)
}
