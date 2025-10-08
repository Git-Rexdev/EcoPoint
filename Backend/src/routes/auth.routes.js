import { Router } from 'express'
import { login, refreshToken, register } from '../controllers/auth.controller.js'
import { requireAuth } from '../middleware/auth.js'
import { User } from '../models/User.js'

export const router = Router()

router.get('/profile', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.sub).select('-passwordHash -deviceSecrets')
    if (!user) return res.status(404).json({ error: true, message: 'User not found' })
    res.json(user)
  } catch (e) {
    next(e)
  }
})

router.post('/register', register)
router.post('/login', login)
router.post('/refresh', refreshToken)

router.post('/rotate-device-secret', requireAuth, async (req, res, next) => {
  try {
    const { deviceId } = req.body || {}
    if (!deviceId) throw new Error('deviceId required')
    const user = await User.findById(req.user.sub)
    const { clientId, secret } = user.issueDeviceSecret(deviceId)
    await user.save()
    res.json({ deviceId, clientId, secret })
  } catch (e) {
    next(e)
  }
})
