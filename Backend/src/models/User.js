
import mongoose from 'mongoose'
import argon2 from 'argon2'
import { nanoid } from 'nanoid'

const DeviceSecretSchema = new mongoose.Schema(
  {
    deviceId: { type: String, required: true, index: true },
    clientId: { type: String, required: true },
    secret: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    refreshVersion: { type: Number, default: 0 },
    refreshHash: { type: String },
    refreshExpiresAt: { type: Date },
  },
  { _id: false }
)

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, index: true },
    phone: { type: String, unique: true, sparse: true },
    name: { type: String },
    role: {
      type: String,
      enum: ['USER', 'BUSINESS', 'ADMIN'],
      default: 'USER',
      index: true,
    },
    passwordHash: { type: String, required: true },
    points: { type: Number, default: 0 },
    totalPointsEarned: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    deviceSecrets: [DeviceSecretSchema],
  },
  { timestamps: true }
)

UserSchema.methods.setPassword = async function (pw) {
  this.passwordHash = await argon2.hash(pw)
}

UserSchema.methods.verifyPassword = async function (pw) {
  return argon2.verify(this.passwordHash, pw)
}

UserSchema.methods.issueDeviceSecret = function (deviceId) {
  const clientId = nanoid(8)
  const secret = nanoid(32)
  this.deviceSecrets = (this.deviceSecrets || []).filter(
    (d) => d.deviceId !== deviceId
  )
  this.deviceSecrets.push({
    deviceId,
    clientId,
    secret,
    createdAt: new Date(),
    refreshVersion: 0,
    refreshHash: undefined,
    refreshExpiresAt: undefined,
  })
  return { clientId, secret }
}

UserSchema.methods.getDeviceSecret = function (deviceId) {
  return (this.deviceSecrets || []).find((d) => d.deviceId === deviceId)
}

UserSchema.methods.updateLevel = function () {
  const POINTS_PER_LEVEL = 200
  const newLevel = Math.floor(this.totalPointsEarned / POINTS_PER_LEVEL) + 1
  const oldLevel = this.level
  this.level = newLevel
  return { oldLevel, newLevel, leveledUp: newLevel > oldLevel }
}

UserSchema.index({ email: 1 }, { unique: true })

export const User = mongoose.model('User', UserSchema)
