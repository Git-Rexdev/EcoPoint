import { verifyAccess } from '../utils/tokens.js'
import { ApiError } from '../utils/error.js'

export function requireAuth(req, res, next) {
  const hdr = req.headers.authorization || ''
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null
  if (!token) return next(new ApiError(401, 'Missing token'))
  try {
    const payload = verifyAccess(token)
    req.user = payload
    return next()
  } catch (e) {
    if (e && e.name === 'TokenExpiredError') {
      return res.status(401).json({ code: 'TOKEN_EXPIRED', message: 'Access token expired' })
    }
    return next(new ApiError(401, 'Invalid token'))
  }
}

export function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Forbidden'))
    }
    next()
  }
}
