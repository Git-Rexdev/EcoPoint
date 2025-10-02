import { User } from '../models/User.js';
import { z } from 'zod';

export async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.user.sub).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Update level based on current points
    const levelUpdate = user.updateLevel();
    if (levelUpdate.leveledUp) {
      await user.save();
    }
    
    // Return user data without password hash
    const userData = user.toObject();
    delete userData.passwordHash;
    delete userData.deviceSecrets;
    
    res.json(userData);
  } catch (e) {
    next(e);
  }
}

const updateRoleSchema = z.object({
  body: z.object({
    role: z.enum(['USER', 'BUSINESS', 'ADMIN'])
  })
});

export async function updateRole(req, res, next) {
  try {
    updateRoleSchema.parse(req);
    
    const user = await User.findById(req.user.sub);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    user.role = req.body.role;
    await user.save();
    
    res.json({ ok: true, role: user.role });
  } catch (e) {
    next(e);
  }
}