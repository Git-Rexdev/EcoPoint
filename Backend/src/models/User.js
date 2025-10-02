
import mongoose from 'mongoose';
import argon2 from 'argon2';
import { nanoid } from 'nanoid';

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, index: true },
  phone: { type: String, unique: true, sparse: true },
  name: { type: String },
  role: { type: String, enum: ['USER','BUSINESS','ADMIN'], default: 'USER', index: true },
  passwordHash: { type: String, required: true },
  points: { type: Number, default: 0 }, // Current available points
  totalPointsEarned: { type: Number, default: 0 }, // Total points ever earned (used for level calculation)
  level: { type: Number, default: 1 },
  deviceSecrets: [{
    deviceId: { type: String, required: true },
    clientId: { type: String, required: true },
    secret: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

UserSchema.methods.setPassword = async function(pw) {
  this.passwordHash = await argon2.hash(pw);
};
UserSchema.methods.verifyPassword = async function(pw) {
  return argon2.verify(this.passwordHash, pw);
};

UserSchema.methods.issueDeviceSecret = function(deviceId) {
  const clientId = nanoid(8);
  const secret = nanoid(32);
  this.deviceSecrets = this.deviceSecrets.filter(d => d.deviceId !== deviceId);
  this.deviceSecrets.push({ deviceId, clientId, secret });
  return { clientId, secret };
};

UserSchema.methods.updateLevel = function() {
  const POINTS_PER_LEVEL = 200;
  const newLevel = Math.floor(this.totalPointsEarned / POINTS_PER_LEVEL) + 1;
  const oldLevel = this.level;
  this.level = newLevel;
  return { oldLevel, newLevel, leveledUp: newLevel > oldLevel };
};

export const User = mongoose.model('User', UserSchema);
