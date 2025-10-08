
import { z } from 'zod'
import ms from 'ms'
import argon2 from 'argon2'
import { User } from '../models/User.js'
import {
  signAccess,
  signRefresh,
  verifyRefresh,
  decodeToken,
  ACCESS_TTL,
  REFRESH_TTL,
} from '../utils/tokens.js'
import { ApiError } from '../utils/error.js'

const regSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(1),
    deviceId: z.string().min(4),
  }),
})

const loginSchema = z
  .object({
    body: z
      .object({
        identifier: z.string().min(1).optional(),
        email: z.string().email().optional(),
        password: z.string().min(8),
        deviceId: z.string().min(4),
      })
      .refine((data) => data.identifier || data.email, {
        message: 'Either identifier or email is required',
        path: ['identifier', 'email'],
      }),
  })

const REFRESH_TTL_MS = ms(REFRESH_TTL)
const nextRefreshExpiry = () => new Date(Date.now() + REFRESH_TTL_MS)
const accessExpMs = (token) =>
  (decodeToken(token)?.exp ?? 0) * 1000 || Date.now() + ms(ACCESS_TTL)

export async function register(req, res, next) {
  try {
    regSchema.parse({ body: req.body })
    const { email, password, name, deviceId } = req.body
    const existing = await User.findOne({ email })
    if (existing) throw new ApiError(409, 'Email already registered')

    const user = new User({ email, name, role: 'USER', passwordHash: 'x' })
    await user.setPassword(password)

    const { clientId, secret } = user.issueDeviceSecret(deviceId)
    const dev = user.deviceSecrets.find((d) => d.deviceId === deviceId)
    const version = dev?.refreshVersion || 0

    const access = signAccess({ sub: user._id.toString(), role: user.role })
    const refresh = signRefresh({
      sub: user._id.toString(),
      role: user.role,
      deviceId,
      ver: version,
    })

    if (dev) {
      dev.refreshVersion = version
      dev.refreshHash = await argon2.hash(refresh)
      dev.refreshExpiresAt = nextRefreshExpiry()
    }

    await user.save()

    res.status(201).json({
      access,
      refresh,
      accessTokenExpiresAt: accessExpMs(access),
      device: { deviceId, clientId, secret },
    })
  } catch (e) {
    next(e)
  }
}

export async function login(req, res, next) {
  try {
    loginSchema.parse({ body: req.body })
    const { identifier, email, password, deviceId } = req.body

    let user
    if (identifier) {
      user = await User.findOne({
        $or: [{ email: identifier }, { name: identifier }],
      })
    } else if (email) {
      user = await User.findOne({ email })
    }
    if (!user) throw new ApiError(401, 'Invalid credentials')

    const ok = await user.verifyPassword(password)
    if (!ok) throw new ApiError(401, 'Invalid credentials')

    const { clientId, secret } = user.issueDeviceSecret(deviceId)
    await user.save()

    const dev = user.deviceSecrets.find((d) => d.deviceId === deviceId)
    const version = dev?.refreshVersion || 0

    const access = signAccess({ sub: user._id.toString(), role: user.role })
    const refresh = signRefresh({
      sub: user._id.toString(),
      role: user.role,
      deviceId,
      ver: version,
    })

    if (dev) {
      dev.refreshVersion = version
      dev.refreshHash = await argon2.hash(refresh)
      dev.refreshExpiresAt = nextRefreshExpiry()
      await user.save()
    }

    res.json({
      access,
      refresh,
      accessTokenExpiresAt: accessExpMs(access),
      device: { deviceId, clientId, secret },
    })
  } catch (e) {
    next(e)
  }
}

export async function refreshToken(req, res, next) {
  try {
    const { refresh, rotate = true } = req.body || {}
    if (!refresh) throw new ApiError(400, 'Missing refresh')

    const payload = verifyRefresh(refresh)
    const { sub: userId, deviceId, ver } = payload

    const user = await User.findById(userId)
    const dev = user?.deviceSecrets?.find((d) => d.deviceId === deviceId)
    if (!dev || !dev.refreshHash) throw new ApiError(401, 'Invalid device')

    const valid = await argon2.verify(dev.refreshHash, refresh)
    if (!valid) throw new ApiError(401, 'Refresh token reuse detected')

    if (typeof ver === 'number' && ver !== (dev.refreshVersion || 0)) {
      throw new ApiError(401, 'Version mismatch')
    }

    const access = signAccess({ sub: user._id.toString(), role: user.role })
    const expMs = accessExpMs(access)

    if (!rotate) {
      return res.json({ access, accessTokenExpiresAt: expMs })
    }

    dev.refreshVersion = (dev.refreshVersion || 0) + 1
    const newRefresh = signRefresh({
      sub: user._id.toString(),
      role: user.role,
      deviceId,
      ver: dev.refreshVersion,
    })
    dev.refreshHash = await argon2.hash(newRefresh)
    dev.refreshExpiresAt = nextRefreshExpiry()
    await user.save()

    res.json({ access, refresh: newRefresh, accessTokenExpiresAt: expMs })
  } catch (e) {
    next(new ApiError(401, 'Invalid refresh'))
  }
}
