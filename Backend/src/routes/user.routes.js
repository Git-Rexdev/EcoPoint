import { Router } from 'express';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import { User } from '../models/User.js';

export const router = Router();

// Get user profile
router.get('/profile', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.sub).select('-passwordHash -deviceSecrets');
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Update level based on current totalPointsEarned
    const levelUpdate = user.updateLevel();
    if (levelUpdate.leveledUp) {
      await user.save();
    }
    
    res.json(user);
  } catch (e) { next(e); }
});

// Update user role (for testing - in production this should be more restricted)
router.patch('/role', requireAuth, async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['USER', 'BUSINESS', 'ADMIN'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    
    const user = await User.findById(req.user.sub);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    user.role = role;
    await user.save();
    
    res.json({ ok: true, role: user.role });
  } catch (e) { next(e); }
});

// Get all users (Admin only)
router.get('/all', requireAuth, requireRoles('ADMIN'), async (req, res, next) => {
  try {
    const users = await User.find({})
      .select('-passwordHash -deviceSecrets')
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (e) { next(e); }
});

// Update any user's role (Admin only)
router.patch('/:userId/role', requireAuth, requireRoles('ADMIN'), async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    
    if (!['USER', 'BUSINESS', 'ADMIN'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Prevent changing admin roles for security
    if (user.role === 'ADMIN' && role !== 'ADMIN') {
      return res.status(403).json({ error: 'Cannot change admin role' });
    }
    
    user.role = role;
    await user.save();
    
    res.json({ ok: true, role: user.role });
  } catch (e) { next(e); }
});